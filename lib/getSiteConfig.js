import SiteConfig from "@/models/siteConfig";
import dbConnect from "@/lib/dbConnect";
export const dynamic = "force-dynamic";
export async function getSiteConfig() {
  await dbConnect();

  let config = await SiteConfig.findOne();

  // Auto-create if missing
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

  // ✅ Convert to plain JSON (no ObjectIds, no Dates)
  const safeConfig = JSON.parse(JSON.stringify(config));

  return safeConfig;
}