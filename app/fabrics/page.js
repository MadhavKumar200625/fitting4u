// app/fabrics/page.js
import dbConnect from "@/lib/dbConnect";
import Fabric from "@/models/Fabric";
import FabricClient from "./FabricClient";

export const revalidate = 60;

const FABRIC_TYPES = [
  { slug: "cotton", label: "Cotton", description: "Breathable everyday fabrics", pattern: "cotton" },
  { slug: "linen", label: "Linen", description: "Lightweight natural blends", pattern: "linen" },
  { slug: "silk", label: "Silk", description: "Elegant festive fabrics", pattern: "silk" },
  { slug: "fluid", label: "Fluid Fabrics", description: "Crepe, georgette, chiffon & rayon", pattern: "georgette|chiffon|crepe|rayon" },
  { slug: "occasion", label: "Occasion & Embellished", description: "Embroidery, sequins, lace & more", pattern: "embroidery|sequins|lace|organza|brocade|jacquard|lurex" },
  { slug: "tailoring", label: "Tailoring", description: "Suiting, shirting, denim & tweed", pattern: "suiting|shirting|denim|tweed|canvas" },
];

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
    type = "",
    all = "",
    page = 1,
    limit = 42,
  } = await searchParams;

  const selectedType = FABRIC_TYPES.find((item) => item.slug === type);
  const availabilityFilter = { status: "Active", stockLeft: { $gt: 2 } };
  const typeFilter = selectedType
    ? { $or: ["name", "collectionName", "material"].map((field) => ({ [field]: new RegExp(selectedType.pattern, "i") })) }
    : null;

  // Build filters
  const filter = { ...availabilityFilter };
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
  const discoveryConditions = [];
  if (typeFilter) discoveryConditions.push(typeFilter);
  if (search) {
    const searchExpression = new RegExp(search, "i");
    discoveryConditions.push({ $or: ["name", "collectionName", "material", "color"].map((field) => ({ [field]: searchExpression })) });
  }
  if (discoveryConditions.length) filter.$and = discoveryConditions;

  const skip = (Number(page) - 1) * Number(limit);

  const [fabrics, collections, materials, weaves, colors, genders, subcategories, typePreviews, total] =
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
      Fabric.distinct("collectionName", availabilityFilter),
      Fabric.distinct("material", availabilityFilter),
      Fabric.distinct("weave", availabilityFilter),
      Fabric.distinct("color", availabilityFilter),
      Fabric.distinct("gender", availabilityFilter),
      Fabric.distinct("material", typeFilter ? { ...availabilityFilter, ...typeFilter } : availabilityFilter),
      Promise.all(FABRIC_TYPES.map(async (fabricType) => {
        const preview = await Fabric.findOne({
          ...availabilityFilter,
          $or: ["name", "collectionName", "material"].map((field) => ({ [field]: new RegExp(fabricType.pattern, "i") })),
        })
          .sort({ createdAt: -1 })
          .select("images")
          .lean();
        return preview?.images?.[0] || "";
      })),
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
      fabricTypes={FABRIC_TYPES.map(({ slug, label, description }, index) => ({ slug, label, description, image: typePreviews[index] }))}
      selectedType={selectedType?.slug || ""}
      subcategories={subcategories.filter(Boolean).sort((a, b) => a.localeCompare(b))}
      browseAll={all === "1"}
      showResults={Boolean(type || all === "1" || search || collection || color || material || weave || gender || minPrice || maxPrice || minStars)}
      total={total}
      totalPages={totalPages}
      page={Number(page)}
      search={search}
      searchParams={searchParams}
    />
  );
}

export const metadata = {
  title: "Luxury Fabrics | Redefine Elegance",
  description:
    "Explore our curated range of premium fabrics designed for modern creators. From silk to linen, experience timeless luxury.",
};
