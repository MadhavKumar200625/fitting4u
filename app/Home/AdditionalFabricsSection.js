import Fabric from "@/models/Fabric";
import Link from "next/link";

export default async function AdditionalFabricsSection({ config }) {
  const slugs = (config?.additionalFabricsSection?.featuredFabrics || []).filter(Boolean);
  if (!slugs.length) return null;

  const fabrics = await Fabric.find({ slug: { $in: slugs }, status: "Active" })
    .lean()
    .select("name slug collectionName customerPrice images material");
  const orderedFabrics = fabrics.sort(
    (a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug)
  );

  if (!orderedFabrics.length) return null;

  return (
    <section className="border-y border-neutral-200 bg-[#f4f7f5] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#51745d]">
              Selected for your next creation
            </p>
            <h2 className="max-w-2xl text-3xl font-bold text-[#183b2b] sm:text-4xl">
              Fabrics worth feeling
            </h2>
          </div>
          <Link
            href="/fabrics"
            className="inline-flex w-fit items-center border-b border-[#183b2b] pb-1 text-sm font-semibold text-[#183b2b] transition hover:text-[#51745d]"
          >
            Explore all fabrics <span className="ml-2" aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {orderedFabrics.map((fabric) => (
            <Link
              key={fabric.slug}
              href={`/fabrics/${fabric.slug}`}
              className="group min-w-0 overflow-hidden border border-[#dce5dc] bg-white transition hover:border-[#9aad9a]"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#e9eee9]">
                {fabric.images?.[0] ? (
                  <img
                    src={fabric.images[0]}
                    alt={fabric.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#617365]">
                    {fabric.material || "Fabric"}
                  </div>
                )}
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#718174]">
                  {fabric.collectionName || fabric.material || "Fitting4U collection"}
                </p>
                <h3 className="truncate text-base font-semibold text-[#183b2b]">
                  {fabric.name}
                </h3>
                <p className="text-sm text-[#4d5d50]">
                  From ₹{fabric.customerPrice}/meter
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}