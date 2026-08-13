import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  if (body.published === false) {
    await supabase
      .from("wedding_sites")
      .update({ published: false, updated_at: new Date().toISOString() })
      .eq("slug", body.slug)
      .eq("user_id", user.id);
    return NextResponse.json({ ok: true });
  }

  await supabase.from("wedding_sites").upsert({
    slug: body.slug,
    user_id: user.id,
    data: body,
    published: true,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
