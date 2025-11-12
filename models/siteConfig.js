import mongoose from "mongoose";

// Banner structure
const BannerSchema = new mongoose.Schema({
  image: { type: String, required: true }, // URL of banner image
  heading: { type: String, trim: true, default: "" },
  subheading: { type: String, trim: true, default: "" },
  buttonText: { type: String, trim: true, default: "" },
  buttonLink: { type: String, trim: true, default: "" },
  visible: { type: Boolean, default: true },
});

// Fabric section structure
const FabricSectionSchema = new mongoose.Schema({
  visible: { type: Boolean, default: true },
  featuredFabrics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fabric",
    },
  ], // Store 4 fabric IDs
});

// Boutique section structure
const BoutiqueSectionSchema = new mongoose.Schema({
  visible: { type: Boolean, default: true },
  featuredBoutiques: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique",
    },
  ], // Store 4 boutique IDs
});

// Full Site Config
const SiteConfigSchema = new mongoose.Schema(
  {
    // 🔹 Orders
    acceptingOrders: {
      type: Boolean,
      default: true,
    },

    // 🔹 Section visibility
    sections: {
      fabricStore: { type: Boolean, default: true },
      boutiques: { type: Boolean, default: true },
      homeMeasurement: { type: Boolean, default: true },
      designNow: { type: Boolean, default: false },
    },

    // 🔹 Homepage data
    homePage: {
      banners: [BannerSchema],
      fabricsSection: { type: FabricSectionSchema, default: () => ({}) },
      boutiquesSection: { type: BoutiqueSectionSchema, default: () => ({}) },
    },

  }
  
);

const SiteConfig =
  mongoose.models.SiteConfig || mongoose.model("SiteConfig", SiteConfigSchema);

export default SiteConfig;