import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ---------------------------------------------
   CITY CENTERS (same as before)
----------------------------------------------*/
const CITY_CENTERS = {
  Delhi: { lat: 28.6139, lon: 77.2090, radiusKm: 30 },
  Mumbai: { lat: 19.0760, lon: 72.8777, radiusKm: 25 },
  Bangalore: { lat: 12.9716, lon: 77.5946, radiusKm: 25 },
  Pune: { lat: 18.5204, lon: 73.8567, radiusKm: 20 },
  Chennai: { lat: 13.0827, lon: 80.2707, radiusKm: 20 },
  Hyderabad: { lat: 17.3850, lon: 78.4867, radiusKm: 25 },
};

/* ---------------------------------------------
   BOUNDING BOX FUNCTION (unchanged)
----------------------------------------------*/
function bboxFor(lat, lon, radiusKm) {
  const latDelta = radiusKm / 110.574;
  const lonDelta =
    radiusKm / (111.320 * Math.cos((lat * Math.PI) / 180));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}

/* ---------------------------------------------
   MAIN HANDLER → NOW A GET FUNCTION
----------------------------------------------*/
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "All";
    const priceRange = searchParams.get("priceRange") || "All";
    const verified = searchParams.get("verified") || "All";
    const location = searchParams.get("location") || "All";

    const pageRaw = searchParams.get("page") || "1";
    const limitRaw = searchParams.get("limit") || "20";

    const page = Math.max(1, parseInt(pageRaw, 10));
    const limit = Math.max(1, Math.min(100, parseInt(limitRaw, 10)));
    const skip = (page - 1) * limit;
    const subLocation = searchParams.get("subLocation") || "All";

    const filters = {};

    // type filter
    if (type !== "All") filters.type = type;

    // priceRange filter
    if (priceRange !== "All") filters.priceRange = priceRange;

    // verified filter
    if (verified === "true") filters.verified = true;
    else if (verified === "false") filters.verified = false;

    // search filter
    if (search.trim().length > 0) {
      const q = search.trim();
      const regex = new RegExp(
        q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filters.$or = [
        { title: regex },
        { tagline: regex },
        { websiteUrl: regex },
        { googleAddress: regex },
      ];
    }

    // location bounding box
    if (location !== "All") {
  const cityInfo = CITY_CENTERS[location];

  if (cityInfo) {
    const { minLat, maxLat, minLon, maxLon } = bboxFor(
      cityInfo.lat,
      cityInfo.lon,
      cityInfo.radiusKm
    );

    filters.lat = { $gte: minLat, $lte: maxLat };
    filters.long = { $gte: minLon, $lte: maxLon };
  }
}

// ===== Sub-location matching =====
if (subLocation !== "All") {
  const regex = new RegExp(
    subLocation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "i"
  );

  filters.googleAddress = regex;
}
    

    // projection same as before
    const projection = {
      title: 1,
      tagline: 1,
      businessLogo: 1,
      googleAddress: 1,
      priceRange: 1,
      type: 1,
      verified: 1,
      websiteUrl: 1,
      lat: 1,
      long: 1,
    };

    const [totalResults, results] = await Promise.all([
      Boutique.countDocuments(filters),
      Boutique.find(filters)
        .select(projection)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalResults / limit));

    return NextResponse.json({
      page,
      limit,
      totalPages,
      totalResults,
      results,
    });
  } catch (err) {
    console.error("boutiques/search error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}