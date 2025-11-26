import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ---------------------------------------------
   Distance Calculation Helper (Haversine)
----------------------------------------------*/
function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ---------------------------------------------
   ROUTE HANDLER → GET SINGLE BOUTIQUE
----------------------------------------------*/
export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { slug } = params; // websiteUrl is slug

    // 1) Fetch boutique details
    const boutique = await Boutique.findOne({ websiteUrl: slug }).lean();
    if (!boutique) {
      return NextResponse.json(
        { success: false, message: "Boutique not found" },
        { status: 404 }
      );
    }

    const { lat, long, type } = boutique;

    /* ---------------------------------------------
       2) NEAR ME → boutiques sorted by closest
    ----------------------------------------------*/
    const allNearby = await Boutique.find({
      websiteUrl: { $ne: slug }, // exclude current
    })
      .select({
        title: 1,
        websiteUrl: 1,
        businessLogo: 1,
        googleAddress: 1,
        type: 1,
        priceRange: 1,
        verified: 1,
        lat: 1,
        long: 1,
      })
      .lean();

    // calculate distances
    const withDistance = allNearby.map((b) => ({
      ...b,
      distanceKm: distanceKm(lat, long, b.lat, b.long),
    }));

    // sort & pick closest 5
    const nearMe = withDistance
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 5);

    /* ---------------------------------------------
       3) RELATED → same type within 50 km, highest rating
       (if no rating field, fall back to updatedAt sort)
    ----------------------------------------------*/
    const relatedRaw = withDistance
      .filter(
        (b) =>
          b.type === type &&
          b.distanceKm <= 50 // within 50km
      )
      .sort((a, b) => {
        const r1 = a.rating || 0;
        const r2 = b.rating || 0;
        return r2 - r1; // highest rating first
      })
      .slice(0, 5);

    /* ---------------------------------------------
       4) RETURN FINAL RESPONSE
    ----------------------------------------------*/
    return NextResponse.json({
      success: true,
      data: boutique, // full boutique object
      nearMe,
      related: relatedRaw,
      distanceUnit: "km",
    });
  } catch (err) {
    console.error("GET boutique by slug error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}