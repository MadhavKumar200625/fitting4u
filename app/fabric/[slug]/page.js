import dbConnect from "@/lib/dbConnect";
import Fabric from "@/models/Fabric";
import FabricClient from "./FabricClient";
import { notFound } from "next/navigation";

// ✅ SEO Metadata
export async function generateMetadata({ params }) {
  await dbConnect();
  const fabric = await Fabric.findOne({ slug: params.slug }).lean();

  if (!fabric)
    return {
      title: "Fabric not found",
      description: "This fabric does not exist or is no longer available.",
    };

  const seo = fabric.seo || {};
  return {
    title:
      seo.metaTitle ||
      `${fabric.name} | ${fabric.collectionName} | Fabric Details`,
    description:
      seo.metaDescription ||
      `Explore ${fabric.name} from the ${fabric.collectionName} collection.`,
    keywords: seo.keywords || [fabric.name, fabric.material, "fabric"],
  };
}

// ✅ Server Component (SSR)
export default async function FabricPage({ params }) {
  await dbConnect();
  let fabric = await Fabric.findOne({ slug: params.slug }).lean();

  // 🧪 Fallback sample data if DB is empty
  if (!fabric) {
    fabric = {
      collectionName: "Royal Silk Collection",
      name: "Ivory Smooth Satin Fabric",
      slug: "ivory-smooth-satin",
      images: [
        "https://peacepoint.in/cdn/shop/files/WhatsAppImage2025-01-31at4.32.13PM_1.jpg?v=1738403022&width=1067",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEwT0vPLeOabzIgS6QR0owce6cjUNU0njQHQ&s",
        "https://peacepoint.in/cdn/shop/files/WhatsAppImage2025-01-31at4.32.13PM_1.jpg?v=1738403022&width=1067",
        "https://peacepoint.in/cdn/shop/files/WhatsAppImage2025-01-31at4.32.13PM_1.jpg?v=1738403022&width=1067",
      ],
      price: 1200,
      customerPrice: 950,
      boutiquePrice: 800,
      stockLeft: 36,
      width: 44,
      material: "Silk Blend",
      weave: "Satin",
      color: "Ivory White",
      avgStars: 4.7,
      description:
        "Luxurious ivory satin with a smooth, glossy finish. Ideal for dresses, sarees, and evening wear. Crafted from premium silk blend for comfort and breathability.",
      careInstructions: [
        "Dry clean recommended",
        "Do not bleach",
        "Iron on low temperature",
      ],
      faqs: [
        {
          question: "Can this fabric be used for bridal wear?",
          answer:
            "Yes, it’s perfect for bridal gowns, lehengas, and dupattas due to its glossy finish.",
        },
        {
          question: "Is it stretchable?",
          answer: "No, it has a structured weave with minimal stretch.",
        },
      ],
      reviews: [
        {
          name: "Aditi Mehra",
          stars: 5,
          review:
            "Beautiful sheen and soft texture — loved the drape quality!",
        },
        {
          name: "Rahul Jain",
          stars: 4,
          review:
            "Good fabric for evening gowns, but slightly thinner than expected.",
        },
      ],
    };
  }

  return <FabricClient fabric={fabric} />;
}