"use client";

import { useState, useMemo } from "react";
import * as Slider from "@radix-ui/react-slider";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function FabricClient({
  fabrics,
  collections,
  materials,
  weaves,
  colors,
  genders,
  total,
  totalPages,
  page,
  search,
}) {
  // 🧠 Compute min/max dynamically based on loaded items
  const prices = fabrics.map((f) => f.customerPrice);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 10000;

  return (
    <main className="min-h-screen bg-gradient-to-br md:pt-2 pt-12 from-[#f8fafc] via-[#eef2f6] to-[#dbeafe] font-[Poppins] text-black relative">
      {/* === HERO SECTION === */}
      <section className="relative flex flex-col items-center text-center pt-32 pb-12 px-6 sm:px-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/textures/fabric-bg.webp')] bg-cover bg-center opacity-10"></div>
        <h1 className="relative text-5xl md:text-6xl font-extrabold text-black tracking-tight drop-shadow-sm">
          Explore Our Signature Fabrics
        </h1>
        <p className="relative mt-4 text-lg text-gray-700 max-w-2xl">
          Experience elegance through texture, color, and craftsmanship. Every
          fabric tells a story — let it define yours.
        </p>
      </section>

      {/* === CONTENT GRID === */}
      <section
        id="collection"
        className="mx-4 lg:mx-12 grid grid-cols-1 lg:grid-cols-4 gap-8 px-2 sm:px-10 pb-20"
      >
        {/* ---------- DESKTOP FILTER ---------- */}
        <aside className="bg-gradient-to-br from-white/90 via-white/70 to-[#f9fafc]/80 backdrop-blur-lg shadow-2xl rounded-3xl border border-neutral-200 p-8 h-fit sticky top-24 hidden lg:block transition-all duration-500 hover:shadow-[0_10px_60px_rgba(0,52,102,0.15)]">
          <h2 className="text-2xl font-bold text-[#003466] mb-8 flex items-center gap-3">
            <span className="inline-block w-2 h-8 bg-[#ffc1cc] rounded-full"></span>
            Refine Your Selection
          </h2>
          <Filters
            collections={collections}
            colors={colors}
            materials={materials}
            weaves={weaves}
            genders={genders}
            dynamicRange={[minPrice, maxPrice]}
          />
        </aside>

        {/* ---------- FABRIC GRID ---------- */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          {/* --- Search + Filter Bar (Improved for Mobile) --- */}
<SearchAndFilterBar search={search} collections={collections} colors={colors} materials={materials} weaves={weaves} genders={genders} dynamicRange={[minPrice, maxPrice]} />

          {/* Grid Heading */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#003466]">
              Showing {fabrics.length} Fabrics
            </h2>
            <span className="text-sm text-gray-600">
              {total.toLocaleString()} total results
            </span>
          </div>

          {/* Fabric Cards */}
          {fabrics.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-500 text-lg">
                No fabrics found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-10">
              {fabrics.map((fabric) => (
                <FabricCard key={fabric._id} fabric={fabric} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && <Pagination current={page} total={totalPages} />}
        </div>
      </section>

      {/* ---------- MOBILE FILTER BUTTON ---------- */}
      <MobileFilters
        collections={collections}
        colors={colors}
        materials={materials}
        weaves={weaves}
        genders={genders}
        dynamicRange={[minPrice, maxPrice]}
      />
    </main>
  );
}

/* ---------------- FABRIC CARD ---------------- */
function FabricCard({ fabric }) {
  return (
    <Link
      href={`/fabric/${fabric.slug}`}
      className="group relative bg-white/80 backdrop-blur-lg rounded-3xl border border-neutral-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
    >
      <div className="relative w-full h-[360px] overflow-hidden">
        <img
          src={
            fabric.images?.[0] ||
            "https://via.placeholder.com/400x400?text=No+Image"
          }
          alt={fabric.name}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-700">
          <h3 className="text-2xl font-semibold mb-1">{fabric.name}</h3>
          <p className="text-sm text-gray-300 mb-2">{fabric.material}</p>
          <p className="text-lg font-semibold text-[#ffc1cc]">
            ₹{fabric.customerPrice}/m
          </p>
        </div>
      </div>

      <div className="p-5 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">
          {fabric.name}
        </h3>
        <p className="text-gray-500 text-sm">{fabric.collectionName}</p>
      </div>
    </Link>
  );
}

/* ---------------- FILTERS ---------------- */
/* ---------------- FILTERS ---------------- */
function Filters({
  collections,
  colors,
  materials,
  weaves,
  genders,
  dynamicRange,
}) {
  const handleReset = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const url = window.location.origin + window.location.pathname;
      window.history.replaceState({}, "", url);
      window.location.reload();
    }
  };

  return (
    <form method="GET" className="space-y-5 animate-fade-in">
      <CheckboxGroup
        title="Collection"
        name="collection"
        options={collections}
      />
      <SearchableCheckboxGroup title="Color" name="color" options={colors} />
      <SearchableCheckboxGroup
        title="Material"
        name="material"
        options={materials}
      />
      <CheckboxGroup title="Weave" name="weave" options={weaves} />
      <RadioGroup title="Gender" name="gender" options={genders} />
      <RangeSlider
        title="Price Range (₹)"
        min={dynamicRange[0]}
        max={dynamicRange[1]}
        step={100}
      />
      <RatingFilter title="Minimum Rating" />

      {/* --- Buttons --- */}
      <div className="flex flex-col gap-3 mt-8">
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-[#003466] text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 hover:bg-[#002850]"
        >
          Apply Filters
        </button>

        <button
          onClick={handleReset}
          type="button"
          className="w-full py-3 rounded-full border border-[#003466]/50 text-[#003466] font-semibold hover:bg-[#003466]/10 transition-all duration-300"
        >
          Reset Filters
        </button>
      </div>
    </form>
  );
}

/* ---------------- RANGE SLIDER ---------------- */
function RangeSlider({ title, min, max, step }) {
  const [values, setValues] = useState([min, max]);
  return (
    <div className="bg-white/70 border border-neutral-200 rounded-2xl p-4">
      <p className="font-semibold text-[#003466] mb-3">{title}</p>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>₹{values[0].toLocaleString()}</span>
        <span>₹{values[1].toLocaleString()}</span>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        min={min}
        max={max}
        step={step}
        value={values}
        onValueChange={(val) => setValues(val)}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-[5px]">
          <Slider.Range className="absolute bg-gradient-to-r from-[#003466] to-[#ffc1cc] rounded-full h-full" />
        </Slider.Track>
        {values.map((_, i) => (
          <Slider.Thumb
            key={i}
            className="block w-5 h-5 bg-[#003466] rounded-full shadow-md hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-[#ffc1cc]"
          />
        ))}
      </Slider.Root>
      <input type="hidden" name="minPrice" value={values[0]} />
      <input type="hidden" name="maxPrice" value={values[1]} />
    </div>
  );
}

/* ---------------- SEARCHABLE CHECKBOX GROUP ---------------- */
function SearchableCheckboxGroup({ title, name, options }) {
  const [search, setSearch] = useState("");
  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <details className="group bg-white/70 border border-neutral-200 rounded-2xl px-4 py-3">
      <summary className="cursor-pointer text-[#003466] font-semibold text-sm select-none flex justify-between">
        {title}
        <span className="transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-neutral-300 rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-[#003466]"
        />
        {filtered.map((opt, i) => (
          <label key={i} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={name}
              value={opt}
              className="accent-[#003466]"
            />
            {opt}
          </label>
        ))}
      </div>
    </details>
  );
}

/* ---------------- CHECKBOX GROUP ---------------- */
function CheckboxGroup({ title, name, options }) {
  return (
    <details className="group bg-white/70 border border-neutral-200 rounded-2xl px-4 py-3">
      <summary className="cursor-pointer text-[#003466] font-semibold text-sm select-none flex justify-between">
        {title}
        <span className="transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="mt-3 space-y-2">
        {options.map((opt, i) => (
          <label key={i} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={name}
              value={opt}
              className="accent-[#003466]"
            />
            {opt}
          </label>
        ))}
      </div>
    </details>
  );
}

/* ---------------- RATING FILTER ---------------- */
function RatingFilter({ title }) {
  return (
    <details className="group bg-white/70 border border-neutral-200 rounded-2xl px-4 py-3">
      <summary className="cursor-pointer text-[#003466] font-semibold text-sm select-none flex justify-between">
        {title}
        <span className="transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="mt-3 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => (
          <label key={star} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="minStars"
              value={star}
              className="accent-[#003466]"
            />
            <span className="text-yellow-400">
              {"★".repeat(star)}{" "}
              <span className="text-gray-400">{"★".repeat(5 - star)}</span>
            </span>
          </label>
        ))}
      </div>
    </details>
  );
}

/* ---------------- MOBILE FILTER DRAWER ---------------- */
function MobileFilters(props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-10 left-5 z-50 bg-[#003466] text-white rounded-full px-6 py-3 shadow-lg hover:scale-105 transition"
      >
        Filters
      </button>

      {/* Animated Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white w-full max-h-[90%] rounded-t-3xl p-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#003466]">
                  Filters
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
              <Filters {...props} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { SlidersHorizontal, Search } from "lucide-react";

/* ---------------- SEARCH & FILTER BAR ---------------- */
function SearchAndFilterBar({
  search,
  collections,
  colors,
  materials,
  weaves,
  genders,
  dynamicRange,
}) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <input
            type="text"
            name="search"
            placeholder="Search fabrics by name or type..."
            defaultValue={search}
            className="w-full border border-neutral-300 rounded-full px-12 py-3 text-sm focus:ring-2 focus:ring-[#003466] bg-white/80 shadow-sm"
          />
          {/* Search Icon */}
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#003466] hover:text-[#002850] transition"
          >
            <Search size={20} />
          </button>

          {/* Filter Icon (Mobile only) */}
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#003466] hover:text-[#002850] transition lg:hidden"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Desktop Search Button */}
        <button
          type="submit"
          className="hidden lg:block px-6 py-3 bg-[#003466] text-white rounded-full font-medium hover:bg-[#002850] transition-all"
        >
          Search
        </button>
      </div>

      {/* Mobile Filters Modal (Bottom Sheet) */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white w-full max-h-[90%] rounded-t-3xl p-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#003466]">
                  Filters
                </h2>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
              <Filters
                collections={collections}
                colors={colors}
                materials={materials}
                weaves={weaves}
                genders={genders}
                dynamicRange={dynamicRange}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- RADIO GROUP ---------------- */
function RadioGroup({ title, name, options }) {
  return (
    <details className="group bg-white/70 border border-neutral-200 rounded-2xl px-4 py-3">
      <summary className="cursor-pointer text-[#003466] font-semibold text-sm select-none flex justify-between items-center">
        {title}
        <span className="transition-transform group-open:rotate-180 text-[#003466]">
          ⌄
        </span>
      </summary>
      <div className="mt-3 space-y-2">
        {options.map((opt, i) => (
          <label
            key={i}
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[#f8fafc] px-2 py-1 rounded-md transition"
          >
            <input
              type="radio"
              name={name}
              value={opt}
              className="accent-[#003466] w-4 h-4 transition-all duration-200 focus:ring-2 focus:ring-[#ffc1cc]"
            />
            <span className="text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </details>
  );
}
/* ---------------- PAGINATION ---------------- */
function Pagination({ current, total }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex justify-center mt-16">
      <div className="flex gap-2">
        {pages.map((p) => (
          <Link
            key={p}
            href={`?page=${p}`}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              p === current
                ? "bg-[#003466] text-white border-[#003466]"
                : "bg-white border-neutral-300 text-gray-700 hover:bg-neutral-100"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>
    </div>
  );
}
