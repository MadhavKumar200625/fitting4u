import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    // === Filters ===
    const query = {};
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type");
    const priceRange = searchParams.get("priceRange");
    const verified = searchParams.get("verified");
    const status = searchParams.get("status");
    const lat = parseFloat(searchParams.get("lat"));
    const long = parseFloat(searchParams.get("long"));
    const distance = parseFloat(searchParams.get("distance")) || 0;

    // === Pagination ===
    const limit = parseInt(searchParams.get("limit")) || 20;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    // === Search Conditions ===
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tagline: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { googleAddress: { $regex: search, $options: "i" } },
        { "seo.metaTitle": { $regex: search, $options: "i" } },
      ];
    }

    if (type && type !== "All") query.type = type;
    if (priceRange && priceRange !== "All") query.priceRange = priceRange;
    if (verified === "true" || verified === "false")
      query.verified = verified === "true";
    if (status && status !== "All") query.status = status;

    // === Location Filter (Geo Proximity) ===
    if (!isNaN(lat) && !isNaN(long) && distance > 0) {
      query.lat = { $exists: true };
      query.long = { $exists: true };

      // crude radius filter (MongoDB 2D index not required)
      query.$expr = {
        $lt: [
          {
            $sqrt: {
              $add: [
                { $pow: [{ $subtract: ["$lat", lat] }, 2] },
                { $pow: [{ $subtract: ["$long", long] }, 2] },
              ],
            },
          },
          distance / 111, // convert km → degrees
        ],
      };
    }

    const [results, total] = await Promise.all([
      Boutique.find(query)
        .sort({ verified: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("title tagline priceRange verified type googleAddress businessLogo websiteUrl"),
      Boutique.countDocuments(query),
    ]);

    return NextResponse.json({
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch boutiques" },
      { status: 500 }
    );
  }
}