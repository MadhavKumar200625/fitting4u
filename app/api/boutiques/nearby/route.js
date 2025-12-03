import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  const lat = parseFloat(searchParams.get("lat"));
  const long = parseFloat(searchParams.get("long"));

  if (!lat || !long) {
    return Response.json({ success: false, error: "Invalid coordinates" });
  }

  const boutiques = await Boutique.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [long, lat],
        },
        distanceField: "distance", // meters
        spherical: true,
        maxDistance: 15000, // 15km
        query: {
          status: "Active",
        },
      },
    },
    { $limit: 5 },
    {
      $project: {
        title: 1,
        googleAddress: 1,
        businessLogo: 1,
        distance: 1,
      },
    },
  ]);

  return Response.json({ success: true, boutiques });
}