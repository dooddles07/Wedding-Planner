import { NextResponse } from "next/server";

/**
 * The one real network call in the product.
 *
 * In this build it validates the shape and logs it. Point it at a CRM, an
 * inbox or a database and every lead capture on the site starts flowing there
 * — nothing on the client needs to change.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.email || typeof body.email !== "string") {
      return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
    }

    console.info("[lead]", {
      source: body.source,
      email: body.email,
      name: body.name,
      weddingDate: body.weddingDate,
      location: body.location,
      guestCount: body.guestCount,
      at: body.createdAt,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }
}
