// /app/api/boutiques/[slug]/route.js  
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ============================================================
   GET /api/boutiques/[slug]
   Returns:
   - Full boutique
   - nearMe[]  (closest 5 boutiques)
   - related[] (same type, within 50km, sorted by rating)
=============================================================== */
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { slug } = params;
    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       1) FETCH MAIN BOUTIQUE
    ----------------------------------------------*/
    const boutique = await Boutique.findOne({ websiteUrl: slug }).lean();

    if (!boutique) {
      return NextResponse.json(
        { success: false, message: "Boutique not found" },
        { status: 404 }
      );
    }

    const { lat, long, type } = boutique;

    if (!lat || !long) {
      return NextResponse.json(
        { success: false, message: "Boutique has no coordinates" },
        { status: 500 }
      );
    }

    /* ---------------------------------------------
       2) NEAR ME → nearest 5 boutiques (fast!)
          Mongo auto-calculates distance
    ----------------------------------------------*/
    const nearMe = await Boutique.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [long, lat] },
          distanceField: "distanceMeters",
          spherical: true,
          query: { websiteUrl: { $ne: slug } },
        }
      },
      { $sort: { distanceMeters: 1 } },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          businessLogo: 1,
          tagline: 1,
          googleAddress: 1,
          priceRange: 1,
          verified: 1,
          type: 1,
          websiteUrl: 1,
          distanceKm: { $divide: ["$distanceMeters", 1000] }
        }
      }
    ]);

    /* ---------------------------------------------
       3) RELATED → same type + within 50km
          sorted by rating (fallback updatedAt)
    ----------------------------------------------*/
    const related = await Boutique.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [long, lat] },
          distanceField: "distanceMeters",
          spherical: true,
          maxDistance: 50 * 1000, // 50 km
          query: {
            type,
            websiteUrl: { $ne: slug }
          },
        }
      },
      {
        $sort: {
          rating: -1,
          updatedAt: -1
        }
      },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          businessLogo: 1,
          tagline: 1,
          googleAddress: 1,
          priceRange: 1,
          verified: 1,
          type: 1,
          websiteUrl: 1,
          distanceKm: { $divide: ["$distanceMeters", 1000] }
        }
      }
    ]);

    return NextResponse.json({
      data: boutique,
      nearMe,
      related,
    });

  } catch (err) {
    console.error("❌ /api/boutiques/[slug] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

