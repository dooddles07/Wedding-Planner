import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { inquiries } from "@/lib/db/schema";
import { sendInquiryEmail } from "@/lib/email/send";
import type { Inquiry } from "@/types";

function shape(row: typeof inquiries.$inferSelect): Inquiry {
  return {
    id: row.id,
    targetSlug: row.targetSlug,
    targetType: row.targetType as Inquiry["targetType"],
    name: row.name,
    email: row.email,
    weddingDate: row.weddingDate,
    message: row.message ?? "",
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
      .insert(inquiries)
      .values({
        targetSlug: body.targetSlug,
        targetType: body.targetType,
        name: body.name,
        email: body.email,
        weddingDate: body.weddingDate ?? null,
        message: body.message ?? null,
      })
      .returning();

    const inquiry = shape(row);
    sendInquiryEmail(inquiry).catch(() => undefined);

    return NextResponse.json(inquiry);
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad request" },
      { status: 400 },
    );
  }
}
