import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { sendLeadEmail } from "@/lib/email/send";
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
    const body = await request.json();

    if (!body?.email || typeof body.email !== "string") {
      return NextResponse.json(
        { ok: false, error: "email required" },
        { status: 400 },
      );
    }

    const [row] = await db
      .insert(leads)
      .values({
        name: body.name ?? null,
        email: body.email,
        weddingDate: body.weddingDate ?? null,
        location: body.location ?? null,
        guestCount: body.guestCount ?? null,
        message: body.message ?? null,
        source: body.source,
        context: body.context ?? {},
      })
      .returning();

    const lead = shape(row);
    sendLeadEmail(lead).catch(() => undefined);

    return NextResponse.json(lead);
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad request" },
      { status: 400 },
    );
  }
}

export async function GET() {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  return NextResponse.json(rows.map(shape));
}
