import SiteConfig from "@/models/siteConfig";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  await dbConnect();
  let config = await SiteConfig.findOne();
  if (!config) {
    config = await SiteConfig.create({
      acceptingOrders: true,
      sections: {
        fabricStore: true,
        boutiques: true,
        homeMeasurement: true,
        designNow: true,
      },
      homePage: {
        banners: [],
        fabricsSection: {},
        boutiquesSection: {},
      },
    });
  }
  return Response.json(JSON.parse(JSON.stringify(config)));
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  let config = await SiteConfig.findOne();
  if (config) {
    config.set(data);
    await config.save();
  } else {
    config = await SiteConfig.create(data);
  }
  return Response.json({ success: true});
}