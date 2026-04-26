import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";
import { requireAdmin } from "@/lib/adminAuth";
import csv from "csvtojson";

/* ================================
   CONSTANTS
================================ */
const DAYS = [
  { key: "Mon", label: "Monday" },
  { key: "Tue", label: "Tuesday" },
  { key: "Wed", label: "Wednesday" },
  { key: "Thu", label: "Thursday" },
  { key: "Fri", label: "Friday" },
  { key: "Sat", label: "Saturday" },
  { key: "Sun", label: "Sunday" },
];

/* ================================
   HELPERS
================================ */
const parseBool = (v) =>
  typeof v === "string" && v.trim().toUpperCase() === "TRUE";

/**
 * Normalize ListingPro price values → schema enum
 */
function normalizePriceRange(v) {
  if (!v) return "Medium";

  const val = String(v).trim().toLowerCase();

  if (val === "notsay") return "Medium";
  if (val === "moderate") return "Medium";
  if (val === "expensive") return "High";
  if (val === "inexpensive") return "Low";

  return "Medium";
}

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

/* ================================
   API
================================ */
export async function POST(req) {
  try {
    await dbConnect();

    /* ---------- AUTH ---------- */
    const admin = await requireAdmin(req, ["SUPER_ADMIN", "SUB_ADMIN"]);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ---------- FILE ---------- */
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "CSV file missing" },
        { status: 400 }
      );
    }

    const csvText = await file.text();
    const rows = await csv().fromString(csvText);

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: "Empty CSV" },
        { status: 400 }
      );
    }

    /* ---------- MAP ---------- */
    const docs = rows.map((r) => {
      // ---- LOGO ----
      const businessLogo =
        r.image && r.image !== "no_image"
          ? r.image.trim()
          : "";

      // ---- GALLERY ----
      const imageGallery =
        r.gallery && r.gallery !== "no_gallery"
          ? r.gallery
              .split("|")
              .map((img) => img.trim())
              .filter(Boolean)
          : [];

      const lat = Number(r.lat);
      const long = Number(r.long);

      return {
        // REQUIRED (SAFE)
        title: r.title?.trim() || "Untitled Boutique",

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

        lat,
        long,

        location: {
          type: "Point",
          coordinates: [long, lat],
        },

        phoneNumber: r.phoneNumber || "",
        whatsappNumber: r.whatsappNumber || "",
        email: r.email?.toLowerCase() || "",

        // REQUIRED + UNIQUE
        websiteUrl: r.websiteUrl.trim(),

        socialLinks: {
          x: r["socialLinks.x"] || "",
          facebook: r["socialLinks.facebook"] || "",
          linkedin: r["socialLinks.linkedin"] || "",
          youtube: r["socialLinks.youtube"] || "",
        },

        // MEDIA
        businessLogo,
        imageGallery,

        // NORMALIZED ENUM
        priceRange: normalizePriceRange(r.priceRange),

        verified: parseBool(r.verified),
        type: r.type || "Unisex",
        status: r.status || "Active",

        faqs: buildFaqs(r),
        businessHours: buildBusinessHours(r),
      };
    });

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