import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { weddingSites } from "@/lib/db/schema";
import { publishSiteSchema as schema } from "@/lib/validation";
import { canClaimSlug } from "@/lib/ownership";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    if (JSON.stringify(body).length > 200_000) {
      return NextResponse.json({ error: "payload too large" }, { status: 413 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const { slug, published } = parsed.data;

    if (published === false) {
      await db
        .update(weddingSites)
        .set({ published: false, updatedAt: new Date() })
        .where(
          and(
            eq(weddingSites.slug, slug),
            eq(weddingSites.userId, session.user.id),
          ),
        );
      return NextResponse.json({ ok: true });
    }

    const [existing] = await db
      .select({ userId: weddingSites.userId })
      .from(weddingSites)
      .where(eq(weddingSites.slug, slug))
      .limit(1);

    if (!canClaimSlug(existing?.userId, session.user.id)) {
      return NextResponse.json(
        { error: "slug already taken" },
        { status: 409 },
      );
    }

    await db
      .insert(weddingSites)
      .values({
        slug,
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
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
