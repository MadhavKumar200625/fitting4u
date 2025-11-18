import dbConnect from "@/lib/dbConnect";
import Fabric from "@/models/Fabric";

export const GET = async (req) => {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const collection = searchParams.get("collection");
    const color = searchParams.get("color");
    const material = searchParams.get("material");
    const weave = searchParams.get("weave");
    const gender = searchParams.get("gender");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minStars = searchParams.get("minStars");

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const skip = (page - 1) * limit;

    // --- BUILD FILTER ---
    const filter = { status: "Active" };

    if (search) filter.name = new RegExp(search, "i");
    if (collection) filter.collectionName = new RegExp(collection, "i");
    if (color) filter.color = new RegExp(color, "i");
    if (material) filter.material = new RegExp(material, "i");
    if (weave) filter.weave = new RegExp(weave, "i");
    if (gender) filter.gender = gender;

    if (minStars)
      filter.avgStars = { $gte: Number(minStars) };

    if (minPrice || maxPrice) {
      filter.customerPrice = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    // --- DATA FETCH IN PARALLEL ---
    const [
      fabrics,
      collections,
      materials,
      weaves,
      colors,
      genders,
      total
    ] = await Promise.all([
      Fabric.find(filter, {
        name: 1,
        slug: 1,
        collectionName: 1,
        customerPrice: 1,
        material: 1,
        weave: 1,
        color: 1,
        gender: 1,
        avgStars: 1,
        images: { $slice: 1 }
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Fabric.distinct("collectionName", { status: "Active" }),
      Fabric.distinct("material", { status: "Active" }),
      Fabric.distinct("weave", { status: "Active" }),
      Fabric.distinct("color", { status: "Active" }),
      Fabric.distinct("gender", { status: "Active" }),
      Fabric.countDocuments(filter)
    ]);

    return new Response(
      JSON.stringify({
        fabrics,
        filters: {
          collections,
          materials,
          weaves,
          colors,
          genders
        },
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("FABRIC EXPLORE API ERROR:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};