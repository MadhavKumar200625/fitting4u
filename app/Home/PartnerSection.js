import Link from "next/link";
import { ArrowUpRight, Store } from "lucide-react";

export default function PartnerSection() {
  return (
    <section className="relative overflow-hidden bg-[#003466] py-24 text-white">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[#ffc1cc]/10" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[1.2fr_0.8fr] md:px-10">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#ffc1cc]">
            For boutique owners
          </p>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
            Bring your boutique into the Fitting4U circle.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            Partner with us to give your customers better fabric discovery,
            precise measurements, and a smoother path from inspiration to a
            perfectly finished outfit.
          </p>
          <Link
            href="/partner-with-us"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ffc1cc] px-7 py-4 font-semibold text-[#003466] shadow-lg"
          >
            Partner with us <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="relative flex min-h-64 items-center justify-center border border-white/15 bg-white/5 p-10 md:min-h-80">
          <Store size={110} strokeWidth={1} className="text-[#ffc1cc]" />
          <span className="absolute bottom-6 left-6 text-sm text-white/50">Made for independent boutiques</span>
        </div>
      </div>
    </section>
  );
}