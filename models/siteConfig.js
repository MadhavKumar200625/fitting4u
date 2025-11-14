import mongoose from "mongoose";

// Banner structure
const BannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  heading: { type: String, trim: true, default: "" },
  subheading: { type: String, trim: true, default: "" },
  buttonText: { type: String, trim: true, default: "" },
  buttonLink: { type: String, trim: true, default: "" },
  visible: { type: Boolean, default: true },
});

// Fabric section structure (SLUGS instead of ObjectIds)
const FabricSectionSchema = new mongoose.Schema({
  visible: { type: Boolean, default: true },
  featuredFabrics: [
    {
      type: String, // fabric slug
      trim: true,
    },
  ], 
});

// Boutique section structure (SLUGS instead of ObjectIds)
const BoutiqueSectionSchema = new mongoose.Schema({
  visible: { type: Boolean, default: true },
  featuredBoutiques: [
    {
      type: String, // boutique slug
      trim: true,
    },
  ],
});

// Full Site Config
const SiteConfigSchema = new mongoose.Schema(
  {
    // Orders
    acceptingOrders: {
      type: Boolean,
      default: true,
    },

    // Section visibility
    sections: {
      fabricStore: { type: Boolean, default: true },
      boutiques: { type: Boolean, default: true },
      homeMeasurement: { type: Boolean, default: true },
      designNow: { type: Boolean, default: false },
    },

    // Homepage
    homePage: {
      banners: [BannerSchema],
      fabricsSection: { type: FabricSectionSchema, default: () => ({}) },
      boutiquesSection: { type: BoutiqueSectionSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

const SiteConfig =
  mongoose.models.SiteConfig || mongoose.model("SiteConfig", SiteConfigSchema);

export default SiteConfig;