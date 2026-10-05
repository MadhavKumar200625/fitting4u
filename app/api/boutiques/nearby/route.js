import dbConnect from "@/lib/dbConnect";
import Boutique from "@/models/boutiqueSchema";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  const lat = parseFloat(searchParams.get("lat"));
  const long = parseFloat(searchParams.get("long"));
  const radiusMeters = parseFloat(searchParams.get("radius")) || 50000;

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
        distanceField: "distance",
        spherical: true,
        maxDistance: radiusMeters,
        query: {
          status: "Active",
        },
      },
    },
    { $sort: { distance: 1 } },
    { $limit: 20 },
    {
      $project: {
        title: 1,
        websiteUrl: 1,
        googleAddress: 1,
        businessLogo: 1,
        distance: 1,
      },
    },
  ]);

  return Response.json({ success: true, boutiques });
}