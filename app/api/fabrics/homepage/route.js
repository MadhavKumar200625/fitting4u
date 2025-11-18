import dbConnect from "@/lib/dbConnect";
import FabricHomeConfig from "@/models/FabricHomeConfig";

export async function GET() {
  await dbConnect();

  let config = await FabricHomeConfig.findOne();

  if (!config) {
    // Create empty config
    config = await FabricHomeConfig.create({
      banners: [],
      featuredFabrics: [],
      categories: [],
      weaves: [],
      colors: []
    });
  }

  return Response.json(JSON.parse(JSON.stringify(config)));
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    let config = await FabricHomeConfig.findOne();

    if (config) {
      config.set(body);
      await config.save();
    } else {
      config = await FabricHomeConfig.create(body);
    }

    return Response.json({ success: true, config });
  } catch (error) {
    console.log(error)
    return Response.json({ error: error.message }, { status: 500 });
  }
}