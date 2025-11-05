// app/fabrics/page.js
import dbConnect from "@/lib/dbConnect";
import Fabric from "@/models/Fabric";
import FabricClient from "./FabricClient";

export const revalidate = 60;

export default async function FabricsPage({ searchParams }) {
  await dbConnect();

  const {
    collection,
    color,
    material,
    weave,
    gender,
    minPrice,
    maxPrice,
    minStars,
    search = "",
    page = 1,
    limit = 20,
  } = await searchParams;

  // Build filters
  const filter = { status: "Active" };
  if (collection) filter.collectionName = new RegExp(collection, "i");
  if (color) filter.color = new RegExp(color, "i");
  if (material) filter.material = new RegExp(material, "i");
  if (weave) filter.weave = new RegExp(weave, "i");
  if (gender) filter.gender = gender;
  if (minStars) filter.avgStars = { $gte: Number(minStars) };
  if (minPrice || maxPrice)
    filter.customerPrice = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };
  if (search) filter.name = new RegExp(search, "i");

  const skip = (Number(page) - 1) * Number(limit);

  const [fabrics, collections, materials, weaves, colors, genders, total] =
    await Promise.all([
      Fabric.find(filter, {
        name: 1,
        collectionName: 1,
        slug: 1,
        material: 1,
        weave: 1,
        color: 1,
        gender: 1,
        price: 1,
        customerPrice: 1,
        avgStars: 1,
        images: { $slice: 1 },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Fabric.distinct("collectionName", { status: "Active" }),
      Fabric.distinct("material", { status: "Active" }),
      Fabric.distinct("weave", { status: "Active" }),
      Fabric.distinct("color", { status: "Active" }),
      Fabric.distinct("gender", { status: "Active" }),
      Fabric.countDocuments(filter),
    ]);

  const totalPages = Math.ceil(total / Number(limit));

  return (
    <FabricClient
      fabrics={JSON.parse(JSON.stringify(fabrics))}
      collections={collections}
      materials={materials}
      weaves={weaves}
      colors={colors}
      genders={genders}
      total={total}
      totalPages={totalPages}
      page={Number(page)}
      search={search}
    />
  );
}

export const metadata = {
  title: "Luxury Fabrics | Redefine Elegance",
  description:
    "Explore our curated range of premium fabrics designed for modern creators. From silk to linen, experience timeless luxury.",
};