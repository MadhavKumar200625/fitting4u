import dbConnect from "@/lib/dbConnect";
import FabricHomeConfig from "@/models/FabricHomeConfig";
import Fabric from "@/models/Fabric";

export async function GET() {
  try {
    await dbConnect();

    // Load homepage config
    let config = await FabricHomeConfig.findOne().lean();

    if (!config) {
      return Response.json({
        banners: [],
        featuredFabrics: [],
        categories: [],
        weaves: [],
        colors: []
      });
    }

    // Fetch selected fabrics (only basic fields)
    const fabrics = await Fabric.find(
      { slug: { $in: config.featuredFabrics } },
      {
        name: 1,
        slug: 1,
        images: { $slice: 1 }, // first image only
        customerPrice: 1,
        material: 1,
        weave: 1,
        color: 1,
        avgStars: 1,
        collectionName: 1,
      }
    ).lean();

    return Response.json({
      banners: config.banners,
      categories: config.categories,
      featuredFabrics: fabrics,  
      weaves: config.weaves,
      colors: config.colors,
      updatedAt: config.updatedAt
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}