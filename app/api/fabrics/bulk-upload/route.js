// app/api/fabrics/bulk/route.js

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import csv from "csv-parser";
import { Readable } from "stream";

import Fabric from "@/models/Fabric";

// ---------------- DB CONNECT ----------------

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(MONGODB_URI);
}

// ---------------- HELPERS ----------------

function extractColor(html = "") {
  const match = html.match(/Color:\s*([^<\n]+)/i);

  return match ? match[1].trim() : "Unknown";
}

function extractWidth(html = "") {
  const match = html.match(/Width:\s*(\d+)/i);

  return match ? Number(match[1]) : 58;
}

function extractMaterial(html = "") {
  const cleaned = html.replace(/<[^>]*>/g, " ");

  const match = cleaned.match(
    /Fabric Material:\s*([^\n]+)/i
  );

  return match
    ? match[1].replace(/\s+/g, " ").trim()
    : "Polyester";
}

function extractCareInstructions(html = "") {
  const cleaned = html.replace(/<[^>]*>/g, " ");

  const match = cleaned.match(/Wash Care:\s*([^\n]+)/i);

  return match ? [match[1].trim()] : [];
}

function cleanDescription(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------- ROUTE ----------------

export async function POST(req) {
  try {
    console.log("🚀 BULK UPLOAD STARTED");

    await connectDB();

    // ---------------- GET FILE ----------------

    const formData = await req.formData();

    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "CSV file is required",
        },
        { status: 400 }
      );
    }

    console.log("📄 FILE RECEIVED:", file.name);

    // ---------------- READ CSV ----------------

    const buffer = Buffer.from(await file.arrayBuffer());

    const stream = Readable.from(buffer);

    const rows = [];

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (data) => rows.push(data))
        .on("end", () => resolve())
        .on("error", (err) => reject(err));
    });

    console.log("📦 TOTAL CSV ROWS:", rows.length);

    // ---------------- GROUP BY HANDLE ----------------

    const groupedProducts = {};

    for (const row of rows) {
      const handle = row["Handle"];

      if (!handle) continue;

      if (!groupedProducts[handle]) {
        groupedProducts[handle] = [];
      }

      groupedProducts[handle].push(row);
    }

    console.log(
      "🧵 TOTAL PRODUCTS:",
      Object.keys(groupedProducts).length
    );

    // ---------------- INSERT PRODUCTS ----------------

    const insertedProducts = [];
    const skippedProducts = [];
    const failedProducts = [];

    for (const handle in groupedProducts) {
      try {
        const productRows = groupedProducts[handle];

        const mainRow = productRows[0];

        const basePrice = Number(
          mainRow["Variant Price"] || 0
        );

        // ---------------- IMAGES ----------------

        const images = productRows
          .map((r) => r["Image Src"])
          .filter(Boolean);

        // ---------------- FABRIC DATA ----------------

        const fabricData = {
          collectionName:
            mainRow["Title"] || "Knitted Lycra",

          name:
            mainRow["Title"] || "Untitled Fabric",

          slug: handle.toLowerCase(),

          images,

          // PRICE LOGIC
          price: Number((basePrice * 2).toFixed(2)),

          customerPrice: Number(
            (basePrice * 1.5).toFixed(2)
          ),

          boutiquePrice: Number(
            (basePrice * 1.1).toFixed(2)
          ),

          stockLeft: Number(
            mainRow["Variant Inventory Qty"] || 0
          ),

          width: extractWidth(
            mainRow["Body (HTML)"]
          ),

          material: extractMaterial(
            mainRow["Body (HTML)"]
          ),

          weave: "Knitted",

          color: extractColor(
            mainRow["Body (HTML)"]
          ),

          description: cleanDescription(
            mainRow["Body (HTML)"]
          ),

          careInstructions:
            extractCareInstructions(
              mainRow["Body (HTML)"]
            ),

          gender: "Unisex",

          seo: {
            metaTitle:
              mainRow["SEO Title"] ||
              mainRow["Title"] ||
              "",

            metaDescription:
              mainRow["SEO Description"] || "",
          },

          status:
            mainRow["Status"] === "active"
              ? "Active"
              : "Inactive",
        };

        console.log(
          "🛠 PROCESSING:",
          fabricData.slug
        );

        // ---------------- CHECK DUPLICATE ----------------

        const existing = await Fabric.findOne({
          slug: fabricData.slug,
        });

        if (existing) {
          console.log(
            "⏭ SKIPPED DUPLICATE:",
            fabricData.slug
          );

          skippedProducts.push(fabricData.slug);

          continue;
        }

        // ---------------- CREATE ----------------

        const created = await Fabric.create(
          fabricData
        );

        insertedProducts.push(created);

        console.log(
          "✅ INSERTED:",
          fabricData.slug
        );
      } catch (err) {
        console.log(
          "❌ FAILED:",
          handle
        );

        console.log(err);

        failedProducts.push({
          handle,
          error: err.message,
        });
      }
    }

    // ---------------- FINAL LOGS ----------------

    console.log(
      "✅ TOTAL INSERTED:",
      insertedProducts.length
    );

    console.log(
      "⏭ TOTAL SKIPPED:",
      skippedProducts.length
    );

    console.log(
      "❌ TOTAL FAILED:",
      failedProducts.length
    );

    // ---------------- RESPONSE ----------------

    return NextResponse.json({
      success: true,

      insertedCount: insertedProducts.length,

      skippedCount: skippedProducts.length,

      failedCount: failedProducts.length,

      skippedProducts,

      failedProducts,

      data: insertedProducts,
    });
  } catch (error) {
    console.error("❌ BULK UPLOAD ERROR");

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Bulk upload failed",
      },
      { status: 500 }
    );
  }
}