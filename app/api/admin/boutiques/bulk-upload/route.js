import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";
import { requireAdmin } from "@/lib/adminAuth";
import csv from "csvtojson";

const DAYS = [
  { key: "Mon", label: "Monday" },
  { key: "Tue", label: "Tuesday" },
  { key: "Wed", label: "Wednesday" },
  { key: "Thu", label: "Thursday" },
  { key: "Fri", label: "Friday" },
  { key: "Sat", label: "Saturday" },
  { key: "Sun", label: "Sunday" },
];

const parseBool = (v) =>
  typeof v === "string" && v.trim().toUpperCase() === "TRUE";

const buildBusinessHours = (row) =>
  DAYS.map((d) => ({
    day: d.label,
    open: row[`${d.key}_open`] || "",
    close: row[`${d.key}_close`] || "",
    isClosed: parseBool(row[`${d.key}_closed`]),
  }));

const buildFaqs = (row) => {
  const faqs = [];
  if (row.faq1_q && row.faq1_a)
    faqs.push({ question: row.faq1_q, answer: row.faq1_a });
  if (row.faq2_q && row.faq2_a)
    faqs.push({ question: row.faq2_q, answer: row.faq2_a });
  return faqs;
};

export async function POST(req) {
  try {
    await dbConnect();

    /* ---------- AUTH ---------- */
    const admin = await requireAdmin(req, ["SUPER_ADMIN"]);
    if (!admin)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    /* ---------- FILE ---------- */
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file)
      return NextResponse.json(
        { success: false, message: "CSV file missing" },
        { status: 400 }
      );

    const csvText = await file.text();
    const rows = await csv().fromString(csvText);

    if (!rows.length)
      return NextResponse.json(
        { success: false, message: "Empty CSV" },
        { status: 400 }
      );

    /* ---------- MAP ---------- */
    const docs = rows.map((r) => ({
      title: r.title?.trim(),
      description: r.description || "",
      tagline: r.tagline || "",

      seo: {
        metaTitle: r["seo.metaTitle"] || "",
        metaDescription: r["seo.metaDescription"] || "",
        keywords: r["seo.keywords"]
          ? r["seo.keywords"]
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
      },

      googleAddress: r.googleAddress || "",
      lat: Number(r.lat),
      long: Number(r.long),

      location: {
        type: "Point",
        coordinates: [Number(r.long), Number(r.lat)],
      },

      phoneNumber: r.phoneNumber || "",
      whatsappNumber: r.whatsappNumber || "",
      email: r.email?.toLowerCase() || "",
      websiteUrl: r.websiteUrl?.trim(),

      socialLinks: {
        x: r["socialLinks.x"] || "",
        facebook: r["socialLinks.facebook"] || "",
        linkedin: r["socialLinks.linkedin"] || "",
        youtube: r["socialLinks.youtube"] || "",
      },

      priceRange: r.priceRange || "Medium",
      verified: parseBool(r.verified),
      type: r.type || "Unisex",
      status: r.status || "Active",

      faqs: buildFaqs(r),
      businessHours: buildBusinessHours(r),
    }));

    /* ---------- INSERT ---------- */
    const result = await Boutique.insertMany(docs, { ordered: false });

    return NextResponse.json({
      success: true,
      inserted: result.length,
    });

  } catch (err) {
    console.error("BULK UPLOAD ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}