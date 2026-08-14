import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { inquiries } from "@/lib/db/schema";
import { sendInquiryEmail } from "@/lib/email/send";
import { checkRateLimit } from "@/lib/rate-limit";
import { inquirySchema as schema } from "@/lib/validation";
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
    if (!(await checkRateLimit(request, "inquiry"))) {
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
      .insert(inquiries)
      .values({
        targetSlug: data.targetSlug,
        targetType: data.targetType,
        name: data.name,
        email: data.email,
        weddingDate: data.weddingDate ?? null,
        message: data.message ?? null,
      })
      .returning();

    const inquiry = shape(row);
    sendInquiryEmail(inquiry).catch((err) =>
      console.error("inquiry email send failed", err),
    );

    return NextResponse.json(inquiry);
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad request" },
      { status: 400 },
    );
  }
}
