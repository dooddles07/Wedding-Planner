import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { rsvps, users, weddingSites } from "@/lib/db/schema";
import { sendRsvpEmail } from "@/lib/email/send";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  siteSlug: z.string().min(1),
  name: z.string().min(1),
  email: z.union([z.email(), z.literal("")]).optional(),
  attending: z.boolean(),
  guests: z.number().min(1).max(20).default(1),
  message: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  try {
    if (!(await checkRateLimit(request, "rsvp"))) {
      return NextResponse.json({ error: "too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const data = parsed.data;

    // Only accept RSVPs for sites that are actually live and have RSVPs
    // turned on — otherwise an attacker who knows a couple's slug can keep
    // POSTing after they've unpublished or disabled RSVPs, each one
    // emailing the couple. See audit P1-6.
    const [targetSite] = await db
      .select({ userId: weddingSites.userId, published: weddingSites.published, data: weddingSites.data })
      .from(weddingSites)
      .where(eq(weddingSites.slug, data.siteSlug))
      .limit(1);

    const rsvpEnabled =
      Boolean(targetSite?.published) &&
      (targetSite?.data as { rsvpEnabled?: boolean } | null)?.rsvpEnabled !== false;

    if (!targetSite || !rsvpEnabled) {
      return NextResponse.json({ error: "RSVPs are not open for this site" }, { status: 404 });
    }

    await db.insert(rsvps).values({
      siteSlug: data.siteSlug,
      name: data.name,
      email: data.email || null,
      attending: data.attending,
      guests: data.guests,
      message: data.message || null,
    });

    if (targetSite.userId) {
      const [owner] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, targetSite.userId))
        .limit(1);

      if (owner?.email) {
        sendRsvpEmail(data, owner.email).catch((err) =>
          console.error("rsvp email send failed", err),
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
