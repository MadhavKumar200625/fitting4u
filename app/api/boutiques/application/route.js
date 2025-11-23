// pages/api/boutiques/search.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";
export const dynamic = "force-dynamic";
export const revalidate = 0;
/**
 * City centers (example). Add/remove cities you need.
 * Each entry: [lat, lon, radiusKm]
 */
const CITY_CENTERS = {
  "Mumbai": { lat: 19.0760, lon: 72.8777, radiusKm: 25 },
  "Delhi": { lat: 28.6139, lon: 77.2090, radiusKm: 30 },
  "Bangalore": { lat: 12.9716, lon: 77.5946, radiusKm: 25 },
  "Pune": { lat: 18.5204, lon: 73.8567, radiusKm: 20 },
  "Chennai": { lat: 13.0827, lon: 80.2707, radiusKm: 20 },
  "Hyderabad": { lat: 17.3850, lon: 78.4867, radiusKm: 25 },
  "Kolkata": { lat: 22.5726, lon: 88.3639, radiusKm: 25 },
  "Jaipur": { lat: 26.9124, lon: 75.7873, radiusKm: 20 }
};

/**
 * Approximate degrees delta for a radius around a lat/lon.
 * Uses simple approximations:
 *  - 1 deg latitude  ≈ 110.574 km
 *  - 1 deg longitude ≈ 111.320 * cos(latitude) km
 */
function bboxFor(lat, lon, radiusKm) {
  const latDelta = radiusKm / 110.574;
  const lonDelta = radiusKm / (111.320 * Math.cos((lat * Math.PI) / 180));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}

export default async function handler(req, res) {
  try {
    await dbConnect();

    const {
      search = "",
      type = "All",
      priceRange = "All",
      verified = "All",
      location = "All",
      page: pageRaw = "1",
      limit: limitRaw = "20",
    } = req.query;

    const page = Math.max(1, parseInt(pageRaw || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(limitRaw || "20", 10)));
    const skip = (page - 1) * limit;

    const filters = {};

    // type filter
    if (type && type !== "All") filters.type = type;

    // priceRange filter
    if (priceRange && priceRange !== "All") filters.priceRange = priceRange;

    // verified filter (true/false)
    if (verified === "true") filters.verified = true;
    else if (verified === "false") filters.verified = false;

    // search: do OR match over title, tagline, websiteUrl, googleAddress
    if (search && search.trim().length > 0) {
      const q = search.trim();
      // safe regex for substring match (case-insensitive)
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filters.$or = [
        { title: regex },
        { tagline: regex },
        { websiteUrl: regex },
        { googleAddress: regex }
      ];
    }

    // location: geo bounding box using lat/long fields in the documents
    if (location && location !== "All") {
      const city = location.trim();
      const cityInfo = CITY_CENTERS[city];
      if (cityInfo) {
        const { minLat, maxLat, minLon, maxLon } = bboxFor(cityInfo.lat, cityInfo.lon, cityInfo.radiusKm);
        filters.lat = { $gte: minLat, $lte: maxLat };
        filters.long = { $gte: minLon, $lte: maxLon };
      } else {
        // fallback: attempt substring match on googleAddress (if city not in map)
        const regex = new RegExp(city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        filters.googleAddress = regex;
      }
    }

    // projection: only fields needed for cards
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
      long: 1
    };

    const [totalResults, results] = await Promise.all([
      Boutique.countDocuments(filters),
      Boutique.find(filters)
        .select(projection)
        .sort({ updatedAt: -1 }) // newest first; change if you'd like relevance sort
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    const totalPages = Math.max(1, Math.ceil(totalResults / limit));

    return res.status(200).json({
      page,
      limit,
      totalPages,
      totalResults,
      results
    });
  } catch (err) {
    console.error("boutiques/search error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}