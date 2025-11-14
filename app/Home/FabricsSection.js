import Fabric from "@/models/Fabric";
import dbConnect from "@/lib/dbConnect";
import { getSiteConfig } from "@/lib/getSiteConfig";
import Link from "next/link";

export default async function FabricShowcase() {
  await dbConnect();

  // Load config from database (SSR)
  const config = await getSiteConfig();

  const slugs = config?.homePage?.fabricsSection?.featuredFabrics || [];

  // Fetch fabrics using slugs
  const fabrics = await Fabric.find({ slug: { $in: slugs } })
    .lean()
    .select("name slug price images material");

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Exquisite Fabrics
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Explore a curated collection of timeless fabrics.
          </p>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {fabrics.map((fabric) => (
            <div
              key={fabric.slug}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Image */}
              <div className="relative w-full h-[360px] overflow-hidden">
                <img
                  src={fabric.images?.[0]}
                  alt={fabric.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <h3 className="text-2xl font-semibold mb-1">{fabric.name}</h3>

                  <p className="text-sm text-gray-200 mb-2">{fabric.material}</p>

                  <p className="text-lg font-medium text-[var(--color-accent)]">
                    ₹{fabric.price}/meter
                  </p>

                  <Link
                    href={`/fabric/${fabric.slug}`}
                    className="mt-4 px-6 py-2 rounded-full bg-white/90 text-gray-900 font-medium shadow-md hover:bg-white transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Static Text */}
              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {fabric.name}
                </h3>
                <p className="text-gray-500 text-sm">{fabric.material}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/fabrics"
            className="px-10 py-4 bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-gray-900 font-medium text-lg rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Browse All Fabrics
          </Link>
        </div>
      </div>
    </section>
  );
}