import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { sendLeadEmail } from "@/lib/email/send";
import { checkRateLimit } from "@/lib/rate-limit";
import { leadSchema as schema } from "@/lib/validation";
import type { Lead } from "@/types";

function shape(row: typeof leads.$inferSelect): Lead {
  return {
    id: row.id,
    name: row.name ?? "",
    email: row.email,
    weddingDate: row.weddingDate,
    location: row.location,
    guestCount: row.guestCount,
    message: row.message,
    source: row.source as Lead["source"],
    context: row.context ?? {},
    createdAt: row.createdAt.toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    if (!(await checkRateLimit(request, "lead"))) {
      return NextResponse.json(
        { ok: false, error: "too many requests" },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid data" },
        { status: 400 },
      );
    }
    const data = parsed.data;

    const [row] = await db
      .insert(leads)
      .values({
        name: data.name ?? null,
        email: data.email,
        weddingDate: data.weddingDate ?? null,
        location: data.location ?? null,
        guestCount: data.guestCount ?? null,
        message: data.message ?? null,
        source: data.source,
        context: data.context ?? {},
      })
      .returning();

    const lead = shape(row);
    sendLeadEmail(lead).catch((err) =>
      console.error("lead email send failed", err),
    );

    return NextResponse.json(lead);
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad request" },
      { status: 400 },
    );
  }
}
