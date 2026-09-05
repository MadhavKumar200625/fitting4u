"use client";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
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
  searchParams,
  fabricTypes,
  selectedType,
  subcategories,
  browseAll,
  showResults,
}) {
  // 🧠 Compute min/max dynamically based on loaded items
  const prices = fabrics.map((f) => f.customerPrice);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 10000;

  useEffect(() => {
    if (!showResults) return;
    const timer = window.setTimeout(() => {
      const targetId = selectedType ? "material-choice" : "collection";
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [showResults, selectedType, browseAll]);

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

      <FabricTypePicker
        fabricTypes={fabricTypes}
        selectedType={selectedType}
        subcategories={subcategories}
        search={search}
        browseAll={browseAll}
      />

      {/* === CONTENT GRID === */}
      {showResults ? <section
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
          {totalPages > 1 && (
  <Pagination
    current={page}
    total={totalPages}
    searchParams={searchParams}
  />
)}
        </div>
      </section> : (
        <section id="collection" className="mx-auto max-w-3xl px-6 pb-20 text-center">
          <div className="rounded-3xl border border-dashed border-[#003466]/20 bg-white/60 p-10 text-gray-600">
            Choose a fabric type above to start browsing our collection.
          </div>
        </section>
      )}

      {/* ---------- MOBILE FILTER BUTTON ---------- */}
      {showResults && <MobileFilters
        collections={collections}
        colors={colors}
        materials={materials}
        weaves={weaves}
        genders={genders}
        dynamicRange={[minPrice, maxPrice]}
      />}
    </main>
  );
}

function FabricTypePicker({ fabricTypes, selectedType, subcategories, search, browseAll }) {
  const hrefFor = (params = {}) => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    Object.entries(params).forEach(([key, value]) => value && query.set(key, value));
    const value = query.toString();
    return `/fabrics${value ? `?${value}` : ""}#collection`;
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-10">
      <div className="rounded-3xl border border-[#003466]/10 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-7">
        <div className="mb-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#003466]">Shop by fabric type</p>
          <h2 className="mt-2 text-2xl font-bold text-[#003466]">What are you making?</h2>
          <p className="mt-1 text-sm text-gray-600">Start with a familiar fabric type, then refine it with the filters below.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {fabricTypes.map((type) => (
            <Link
              key={type.slug}
              href={hrefFor({ type: type.slug })}
              className={`group relative overflow-hidden rounded-2xl border p-0 text-left transition ${selectedType === type.slug ? "border-[#003466] bg-[#003466] text-white shadow-md" : "border-gray-200 bg-white text-[#003466] hover:border-[#003466]/50"}`}
            >
              <div className="h-24 bg-[#003466]/10">
                {type.image ? <img src={type.image} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : null}
              </div>
              <div className="p-4"><p className="font-bold">{type.label}</p><p className={`mt-1 text-xs ${selectedType === type.slug ? "text-white/80" : "text-gray-500"}`}>{type.description}</p></div>
            </Link>
          ))}
          <Link href={hrefFor({ all: "1" })} className={`rounded-2xl border p-4 transition ${browseAll ? "border-[#ffc1cc] bg-[#ffc1cc]/25 text-[#003466]" : "border-gray-200 bg-white text-[#003466] hover:border-[#003466]/50"}`}>
            <p className="font-bold">See all fabrics</p>
            <p className="mt-1 text-xs text-gray-500">Browse the complete collection</p>
          </Link>
        </div>

        {selectedType && subcategories.length > 0 && (
          <div id="material-choice" className="mt-6 scroll-mt-28 border-t border-gray-100 pt-5">
            <p className="mb-3 text-sm font-semibold text-[#003466]">Choose a material</p>
            <div className="flex flex-wrap gap-2">
              {subcategories.slice(0, 14).map((material) => (
                <Link key={material} href={hrefFor({ type: selectedType, material })} className="rounded-full border border-[#003466]/20 bg-[#f6f9ff] px-3 py-1.5 text-sm text-[#003466] hover:bg-[#003466] hover:text-white">
                  {material}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- FABRIC CARD ---------------- */
function FabricCard({ fabric }) {
  return (
    <Link
      href={`/fabrics/${fabric.slug}`}
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
function Pagination({ current, total, searchParams }) {

  const maxVisible = 5;

  let startPage = Math.max(

    current - Math.floor(maxVisible / 2),

    1

  );

  let endPage = startPage + maxVisible - 1;

  if (endPage > total) {

    endPage = total;

    startPage = Math.max(endPage - maxVisible + 1, 1);

  }

  const pages = [];

  for (let i = startPage; i <= endPage; i++) {

    pages.push(i);

  }

  // Remove current page from query params

  const baseQuery = new URLSearchParams(

    Object.fromEntries(

      Object.entries(searchParams || {}).filter(

        ([key]) => key !== "page"

      )

    )

  );

  const createPageLink = (page) => {

    const params = new URLSearchParams(baseQuery);

    params.set("page", page);

    return `?${params.toString()}`;

  };

  return (

    <div className="flex justify-center items-center mt-16 px-4">

      <div className="flex items-center gap-2 flex-wrap justify-center">

        {/* PREV BUTTON */}

        <Link

          href={createPageLink(

            current > 1 ? current - 1 : 1

          )}

          className={`

            flex items-center justify-center

            w-10 h-10 rounded-full border transition-all duration-300

            ${

              current === 1

                ? "pointer-events-none opacity-40 bg-neutral-100 border-neutral-200"

                : "bg-white hover:bg-[#003466] hover:text-white border-neutral-300 shadow-sm hover:shadow-md"

            }

          `}

        >

          <ChevronLeft size={18} />

        </Link>

        {/* FIRST PAGE */}

        {startPage > 1 && (

          <>

            <Link

              href={createPageLink(1)}

              className="w-10 h-10 flex items-center justify-center rounded-full border bg-white border-neutral-300 hover:bg-neutral-100 transition"

            >

              1

            </Link>

            {startPage > 2 && (

              <span className="px-1 text-gray-400">

                ...

              </span>

            )}

          </>

        )}

        {/* PAGE NUMBERS */}

        {pages.map((p) => (

          <Link

            key={p}

            href={createPageLink(p)}

            className={`

              w-10 h-10 flex items-center justify-center

              rounded-full text-sm font-medium

              transition-all duration-300 border

              ${

                p === current

                  ? "bg-[#003466] text-white border-[#003466] shadow-lg scale-105"

                  : "bg-white text-gray-700 border-neutral-300 hover:bg-[#003466] hover:text-white hover:border-[#003466]"

              }

            `}

          >

            {p}

          </Link>

        ))}

        {/* LAST PAGE */}

        {endPage < total && (

          <>

            {endPage < total - 1 && (

              <span className="px-1 text-gray-400">

                ...

              </span>

            )}

            <Link

              href={createPageLink(total)}

              className="w-10 h-10 flex items-center justify-center rounded-full border bg-white border-neutral-300 hover:bg-neutral-100 transition"

            >

              {total}

            </Link>

          </>

        )}

        {/* NEXT BUTTON */}

        <Link

          href={createPageLink(

            current < total ? current + 1 : total

          )}

          className={`

            flex items-center justify-center

            w-10 h-10 rounded-full border transition-all duration-300

            ${

              current === total

                ? "pointer-events-none opacity-40 bg-neutral-100 border-neutral-200"

                : "bg-white hover:bg-[#003466] hover:text-white border-neutral-300 shadow-sm hover:shadow-md"

            }

          `}

        >

          <ChevronRight size={18} />

        </Link>

      </div>

    </div>

  );

}
