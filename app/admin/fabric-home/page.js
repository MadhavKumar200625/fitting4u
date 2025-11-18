"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash } from "lucide-react";
import ImageUploader from "@/components/ImageUploader"; // <— your uploader

export default function FabricHomeAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    banners: [],
    featuredFabrics: [],
    categories: [],
    weaves: [],
    colors: []
  });

  /* -------------------- FETCH CONFIG -------------------- */
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/fabrics/homepage");
      const data = await res.json();

      setForm({
        banners: data.banners ?? [],
        featuredFabrics: data.featuredFabrics ?? [],
        categories: data.categories ?? [],
        weaves: data.weaves ?? [],
        colors: data.colors ?? []
      });

      setLoading(false);
    }
    load();
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* -------------------- SAVE CONFIG -------------------- */
  const saveConfig = async () => {
    setSaving(true);
    await fetch("/api/fabrics/homepage", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(form)
});
    setSaving(false);
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-bold text-[#003466]">Fabric Homepage Config</h1>

      {/* -----------------------------------------------------
                        BANNERS
      ------------------------------------------------------ */}
      <Section title="Homepage Banners">
        {form.banners.map((banner, i) => (
          <div key={i} className="bg-white border rounded-2xl p-4 shadow-md space-y-4">
            <ImageUploader
              value={banner.image}
              onChange={(url) => {
                const arr = [...form.banners];
                arr[i].image = url;
                updateField("banners", arr);
              }}
            />

            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Heading"
                value={banner.heading}
                className="border p-2 rounded-lg"
                onChange={(e) => {
                  const arr = [...form.banners];
                  arr[i].heading = e.target.value;
                  updateField("banners", arr);
                }}
              />
              <input
                type="text"
                placeholder="Subheading"
                value={banner.subheading}
                className="border p-2 rounded-lg"
                onChange={(e) => {
                  const arr = [...form.banners];
                  arr[i].subheading = e.target.value;
                  updateField("banners", arr);
                }}
              />
            </div>

            <button
              onClick={() =>
                updateField(
                  "banners",
                  form.banners.filter((_, idx) => idx !== i)
                )
              }
              className="text-red-600 flex items-center gap-2"
            >
              <Trash size={18} /> Remove Banner
            </button>
          </div>
        ))}

        <AddButton
          label="Add Banner"
          onClick={() =>
            updateField("banners", [
              ...form.banners,
              { image: "", heading: "", subheading: "" }
            ])
          }
        />
      </Section>

      {/* -----------------------------------------------------
                    FEATURED FABRICS
      ------------------------------------------------------ */}
      <Section title="Featured Fabrics (Slugs)">
        {form.featuredFabrics.map((slug, i) => (
          <Row key={i}>
            <input
              type="text"
              value={slug}
              placeholder="fabric-slug"
              className="flex-1 p-2 border rounded-lg"
              onChange={(e) => {
                const arr = [...form.featuredFabrics];
                arr[i] = e.target.value;
                updateField("featuredFabrics", arr);
              }}
            />
            <Trash
              className="text-red-500 cursor-pointer"
              onClick={() =>
                updateField(
                  "featuredFabrics",
                  form.featuredFabrics.filter((_, idx) => idx !== i)
                )
              }
            />
          </Row>
        ))}

        <AddButton
          label="Add Slug"
          onClick={() =>
            updateField("featuredFabrics", [...form.featuredFabrics, ""])
          }
        />
      </Section>

      {/* -----------------------------------------------------
                        CATEGORIES
      ------------------------------------------------------ */}
      <Section title="Categories (Name + Image)">
        {form.categories.map((cat, i) => (
          <div key={i} className="bg-white border rounded-2xl p-4 shadow space-y-4">
            <ImageUploader
              value={cat.image}
              onChange={(url) => {
                const arr = [...form.categories];
                arr[i].image = url;
                updateField("categories", arr);
              }}
            />

            <input
              type="text"
              placeholder="Category Name"
              value={cat.name}
              className="border p-2 rounded-lg w-full"
              onChange={(e) => {
                const arr = [...form.categories];
                arr[i].name = e.target.value;
                updateField("categories", arr);
              }}
            />

            <button
              onClick={() =>
                updateField(
                  "categories",
                  form.categories.filter((_, idx) => idx !== i)
                )
              }
              className="text-red-600 flex items-center gap-2"
            >
              <Trash size={18} /> Remove Category
            </button>
          </div>
        ))}

        <AddButton
          label="Add Category"
          onClick={() =>
            updateField("categories", [...form.categories, { name: "", image: "" }])
          }
        />
      </Section>

      {/* -----------------------------------------------------
                        WEAVES
      ------------------------------------------------------ */}
      <Section title="Weaves (Name + Image)">
        {form.weaves.map((w, i) => (
          <div key={i} className="bg-white border rounded-2xl p-4 shadow space-y-4">
            <ImageUploader
              value={w.image}
              onChange={(url) => {
                const arr = [...form.weaves];
                arr[i].image = url;
                updateField("weaves", arr);
              }}
            />

            <input
              type="text"
              placeholder="Weave Name"
              value={w.name}
              className="border p-2 rounded-lg w-full"
              onChange={(e) => {
                const arr = [...form.weaves];
                arr[i].name = e.target.value;
                updateField("weaves", arr);
              }}
            />

            <button
              onClick={() =>
                updateField(
                  "weaves",
                  form.weaves.filter((_, idx) => idx !== i)
                )
              }
              className="text-red-600 flex items-center gap-2"
            >
              <Trash size={18} /> Remove Weave
            </button>
          </div>
        ))}

        <AddButton
          label="Add Weave"
          onClick={() =>
            updateField("weaves", [...form.weaves, { name: "", image: "" }])
          }
        />
      </Section>

      {/* -----------------------------------------------------
                        COLORS
      ------------------------------------------------------ */}
      <Section title="Colors">
        {form.colors.map((col, i) => (
          <Row key={i}>
            <input
              type="text"
              value={col}
              placeholder="Color Name"
              className="flex-1 p-2 border rounded-lg"
              onChange={(e) => {
                const arr = [...form.colors];
                arr[i] = e.target.value;
                updateField("colors", arr);
              }}
            />
            <Trash
              className="text-red-500 cursor-pointer"
              onClick={() =>
                updateField("colors", form.colors.filter((_, idx) => idx !== i))
              }
            />
          </Row>
        ))}

        <AddButton
          label="Add Color"
          onClick={() => updateField("colors", [...form.colors, ""])}
        />
      </Section>

      {/* -----------------------------------------------------
                          SAVE
      ------------------------------------------------------ */}
      <button
        onClick={saveConfig}
        className="w-full py-4 rounded-xl bg-[#003466] text-white text-lg font-semibold shadow-lg hover:bg-[#002850] transition-all flex items-center justify-center gap-2"
      >
        <Save size={20} />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

/* ---------------- REUSABLE UI COMPONENTS ---------------- */

function Section({ title, children }) {
  return (
    <div className="bg-white/90 backdrop-blur-md border shadow-xl rounded-3xl p-6 space-y-4">
      <h2 className="text-2xl font-bold text-[#003466] mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Row({ children }) {
  return (
    <div className="flex items-center gap-3 bg-white border rounded-xl p-4 shadow">
      {children}
    </div>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#003466] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#002850] transition"
    >
      <Plus size={16} /> {label}
    </button>
  );
}