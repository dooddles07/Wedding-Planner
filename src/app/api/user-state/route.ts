import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { userState } from "@/lib/db/schema";
import { checkUserRateLimit } from "@/lib/rate-limit";
import { userStatePutSchema as putSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (!key)
    return NextResponse.json({ error: "key required" }, { status: 400 });

  const [row] = await db
    .select({ value: userState.value })
    .from(userState)
    .where(and(eq(userState.userId, session.user.id), eq(userState.key, key)))
    .limit(1);

  return NextResponse.json({ value: row?.value ?? null });
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!(await checkUserRateLimit(session.user.id, "user-state-put")))
      return NextResponse.json({ error: "too many requests" }, { status: 429 });

    const body = await request.json();
    const parsed = putSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "invalid data" }, { status: 400 });

    const { key, value } = parsed.data;

    await db
      .insert(userState)
      .values({ userId: session.user.id, key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [userState.userId, userState.key],
        set: { value, updatedAt: new Date() },
      });

    return NextResponse.json({ ok: true });
  } catch {
    // Anything reaching here is past the safeParse check above, so it's a
    // DB/network failure, not a client error — 500 says so and lets the
    // client's setItem (which now throws on !res.ok) tell the couple their
    // save didn't land instead of assuming it did. See audit P2-3.
    return NextResponse.json({ error: "could not save" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!(await checkUserRateLimit(session.user.id, "user-state-delete")))
      return NextResponse.json({ error: "too many requests" }, { status: 429 });

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (!key)
      return NextResponse.json({ error: "key required" }, { status: 400 });

    await db
      .delete(userState)
      .where(
        and(eq(userState.userId, session.user.id), eq(userState.key, key)),
      );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "could not delete" }, { status: 500 });
  }
}
