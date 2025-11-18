import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  image: { type: String,  },
  heading: { type: String, trim: true },
  subheading: { type: String, trim: true }
});

const categorySchema = new mongoose.Schema({
  name: { type: String,  trim: true },
  image: { type: String,  }
});

const weaveSchema = new mongoose.Schema({
  name: { type: String,  trim: true },
  image: { type: String,  }
});

const fabricHomeConfigSchema = new mongoose.Schema(
  {
    banners: [bannerSchema],

    featuredFabrics: [{ type: String }], // fabric slugs

    categories: [categorySchema],

    weaves: [weaveSchema],

    colors: [{ type: String }]
  },
  { timestamps: true }
);

const FabricHomeConfig =
  mongoose.models.FabricHomeConfig ||
  mongoose.model("FabricHomeConfig", fabricHomeConfigSchema);

export default FabricHomeConfig;