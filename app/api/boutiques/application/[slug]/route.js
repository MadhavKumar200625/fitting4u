// /app/api/boutiques/[slug]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { slug } = await params;
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

    const lat = Number(boutique.lat) || 0;
    const long = Number(boutique.long) || 0;
    const { type } = boutique;



    if (lat == null || long == null) {
      return NextResponse.json(
        { success: false, message: "Boutique has no coordinates" },
        { status: 400 }
      );
    }

    /* ---------------------------------------------
       2) NEAR ME
    ----------------------------------------------*/
    const nearMe = await Boutique.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [long, lat],
          },
          distanceField: "distanceMeters",
          spherical: true,
          query: { websiteUrl: { $ne: slug } },
        },
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
          distanceKm: { $divide: ["$distanceMeters", 1000] },
        },
      },
    ]);

    /* ---------------------------------------------
       3) RELATED
    ----------------------------------------------*/
    const related = await Boutique.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [long, lat],
          },
          distanceField: "distanceMeters",
          spherical: true,
          maxDistance: 50 * 1000,
          query: {
            type,
            websiteUrl: { $ne: slug },
          },
        },
      },
      { $sort: { rating: -1, updatedAt: -1 } },
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
          distanceKm: { $divide: ["$distanceMeters", 1000] },
        },
      },
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