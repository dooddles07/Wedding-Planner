import { NextResponse } from "next/server";
import { sendInquiryEmail } from "@/lib/email/send";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.email || typeof body.email !== "string") {
      return NextResponse.json(
        { ok: false, error: "email required" },
        { status: 400 },
      );
    }

    sendInquiryEmail(body).catch(() => undefined);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad request" },
      { status: 400 },
    );
  }
}
