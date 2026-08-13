import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";
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
  const supabase = await createServerClient();

  await supabase.from("rsvps").insert({
    site_slug: data.siteSlug,
    name: data.name,
    email: data.email || null,
    attending: data.attending,
    guests: data.guests,
    message: data.message || null,
  });

  const service = await createServiceClient();
  const { data: site } = await service
    .from("wedding_sites")
    .select("user_id")
    .eq("slug", data.siteSlug)
    .single();

  if (site?.user_id) {
    const { data: userData } = await service.auth.admin.getUserById(
      site.user_id,
    );
    if (userData?.user?.email) {
      sendRsvpEmail(data, userData.user.email).catch(() => undefined);
    }
  }

  return NextResponse.json({ ok: true });
}
