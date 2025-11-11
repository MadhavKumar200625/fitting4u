import dbConnect from "@/lib/dbConnect";
import Fabric from "@/models/Fabric";
import FabricClient from "./FabricClient";
import { notFound } from "next/navigation";

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
      `${fabric.name} | ${fabric.collectionName} | Premium Fabric by Maison Textiles`,
    description:
      seo.metaDescription ||
      `Explore ${fabric.name} from the ${fabric.collectionName} — crafted with elegance, softness, and superior texture for modern couture.`,
    keywords:
      seo.keywords ||
      [fabric.name, fabric.material, fabric.weave, "luxury fabric", "designer textile"],
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
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcNACGUf9T5RjYfDK84ukD2fksq5qB_Iphjw&s",
        "https://peacepoint.in/cdn/shop/files/WhatsAppImage2025-01-31at4.32.13PM_1.jpg?v=1738403022&width=1067",
        "https://peacepoint.in/cdn/shop/files/WhatsAppImage2025-01-31at4.32.13PM_1.jpg?v=1738403022&width=1067",
      ],
      price: 1200,
      customerPrice: 950,
      boutiquePrice: 800,
      stockLeft: 42,
      width: 44,
      material: "Premium Silk Blend",
      weave: "Satin",
      color: "Ivory White",
      avgStars: 4.8,
      description: `
      The Ivory Smooth Satin is part of our **Royal Silk Collection**, known for its flawless sheen, feather-soft touch, and fluid drape. 
      Made with a luxurious silk blend, this satin showcases a gentle pearl-like glow that beautifully reflects light, making it ideal for bridal and couture ensembles.
      
      Whether you’re designing evening gowns, sarees, or statement drapes, this fabric exudes elegance and refinement. It’s breathable, soft, and sits comfortably against the skin — making it perfect for both festive and formal wear.
      
      Each meter is woven with precision using fine satin threads to achieve unmatched lustre and texture. 
      `,
      careInstructions: [
        "Dry clean only to preserve shine and texture.",
        "Avoid direct sunlight exposure when storing.",
        "Do not bleach or wring.",
        "Steam iron on low temperature with inner side out.",
        "Fold with tissue layers to prevent creasing.",
      ],
      faqs: [
        {
          question: "Can this fabric be used for bridal or evening gowns?",
          answer:
            "Absolutely. Its elegant sheen and smooth flow make it ideal for bridal gowns, lehengas, and high-end couture wear.",
        },
        {
          question: "Is it stretchable or structured?",
          answer:
            "It has a soft body with a slightly structured weave, providing graceful fall without being clingy.",
        },
        {
          question: "Does it require lining?",
          answer:
            "For lighter shades like ivory, lining is recommended for opacity and enhanced finish.",
        },
        {
          question: "How wide is the fabric roll?",
          answer:
            "Each roll is 44 inches wide, suitable for standard tailoring and dressmaking requirements.",
        },
      ],
      reviews: [
        {
          name: "Aditi Mehra",
          stars: 5,
          review:
            "Absolutely stunning fabric — the sheen is subtle and elegant, not too glossy. Perfect for my wedding outfit!",
        },
        {
          name: "Rahul Jain",
          stars: 4,
          review:
            "Good quality and smooth texture, though slightly lighter than I expected. Works well for layered gowns.",
        },
        {
          name: "Shreya Kapoor",
          stars: 5,
          review:
            "Loved the luxurious feel! Drapes like a dream and the color looks classy under soft lighting.",
        },
        {
          name: "Nikita Shah",
          stars: 5,
          review:
            "Beautiful ivory tone — soft yet strong weave. Perfect for high-end blouses and dupattas!",
        },
        {
          name: "Arjun Menon",
          stars: 4,
          review:
            "Good purchase overall. Delivery was quick, and the fabric came neatly packed in rolls.",
        },
      ],
      seo: {
        metaTitle: "Ivory Smooth Satin Fabric | Royal Silk Collection | Maison Textiles",
        metaDescription:
          "Experience the unmatched elegance of our Ivory Smooth Satin — a part of the Royal Silk Collection. Ideal for couture, sarees, and bridal wear.",
        keywords: [
          "satin fabric",
          "ivory silk fabric",
          "bridal satin material",
          "luxury fabric online",
          "Maison textiles",
          "premium silk blend",
        ],
      },
    };
  }

  return <FabricClient fabric={JSON.parse(JSON.stringify(fabric))} />;
}