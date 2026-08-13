import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { weddingSites } from "@/lib/db/schema";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  if (body.published === false) {
    await db
      .update(weddingSites)
      .set({ published: false, updatedAt: new Date() })
      .where(
        and(
          eq(weddingSites.slug, body.slug),
          eq(weddingSites.userId, session.user.id),
        ),
      );
    return NextResponse.json({ ok: true });
  }

  await db
    .insert(weddingSites)
    .values({
      slug: body.slug,
      userId: session.user.id,
      data: body,
      published: true,
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: weddingSites.slug,
      set: {
        userId: session.user.id,
        data: body,
        published: true,
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ ok: true });
}
