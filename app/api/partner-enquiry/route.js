import { NextResponse } from "next/server";
import { sendPartnerEnquiryEmail } from "@/lib/mailer";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requiredFields = ["boutiqueName", "contactName", "email", "phone", "city"];

export async function POST(req) {
  try {
    const body = await req.json();
    const enquiry = Object.fromEntries(
      ["boutiqueName", "contactName", "email", "phone", "city", "website", "message"].map((field) => [
        field,
        typeof body[field] === "string" ? body[field].trim() : "",
      ])
    );

    if (requiredFields.some((field) => !enquiry[field])) {
      return NextResponse.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (!emailPattern.test(enquiry.email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const recipient = process.env.SMTP_USER;
    if (!recipient) {
      throw new Error("ORDER_VENDOR_EMAIL or SMTP_USER must be configured");
    }

    await sendPartnerEnquiryEmail({ enquiry, recipient });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PARTNER ENQUIRY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "We could not send your enquiry. Please try again." },
      { status: 500 }
    );
  }
}