import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { rsvps, users, weddingSites } from "@/lib/db/schema";
import { sendRsvpEmail } from "@/lib/email/send";

const schema = z.object({
  siteSlug: z.string().min(1),
  name: z.string().min(1),
  email: z.union([z.email(), z.literal("")]).optional(),
  attending: z.boolean(),
  guests: z.number().min(1).max(20).default(1),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const data = parsed.data;

  await db.insert(rsvps).values({
    siteSlug: data.siteSlug,
    name: data.name,
    email: data.email || null,
    attending: data.attending,
    guests: data.guests,
    message: data.message || null,
  });

  const [site] = await db
    .select({ userId: weddingSites.userId })
    .from(weddingSites)
    .where(eq(weddingSites.slug, data.siteSlug))
    .limit(1);

  if (site?.userId) {
    const [owner] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, site.userId))
      .limit(1);

    if (owner?.email) {
      sendRsvpEmail(data, owner.email).catch(() => undefined);
    }
  }

  return NextResponse.json({ ok: true });
}
