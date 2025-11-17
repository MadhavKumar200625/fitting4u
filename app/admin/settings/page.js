"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

export default function SiteConfigAdmin() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchConfig() {
      try {
        const res = await fetch("/api/site-config");
        const data = await res.json();
        if (data) {
          setConfig(data);
        } else {
          toast.error("Failed to fetch site config");
        }
      } catch (e) {
        toast.error("Error fetching config");
      } finally {
        setLoading(false);
      }
    }

  // ✅ Fetch existing config
  useEffect(() => {
    
    fetchConfig();
  }, []);

  // ✅ Save config
  const saveConfig = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        fetchConfig()
        toast.success("Configuration updated successfully!");
      } else {
        toast.error("Failed to save config");
      }
    } catch {
      toast.error("Error saving configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading configuration...
      </div>
    );

  if (!config)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No config found and could not be created.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef5ff] to-white px-4 sm:px-10 py-10 font-[Poppins]">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#003466] mb-10 text-center tracking-tight">
        ⚙️ Site Configuration Dashboard
      </h1>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 space-y-10 border border-[#003466]/10">
        {/* 🔹 Accepting Orders */}
        <section className="border-l-4 border-[#003466] bg-[#f9fbff] rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#003466] mb-4 flex items-center gap-2">
            Accepting Orders
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.acceptingOrders}
              onChange={(e) =>
                setConfig({ ...config, acceptingOrders: e.target.checked })
              }
              className="w-5 h-5 accent-[#003466] cursor-pointer"
            />
            <span className="text-gray-700 font-medium">
              Enable accepting new customer orders
            </span>
          </label>
        </section>

        {/* 🔹 Section Visibility */}
        <section className="border-l-4 border-[#ffc1cc] bg-[#fff8f9] rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#c12d58] mb-4 flex items-center gap-2">
            Section Visibility
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.keys(config.sections || {}).map((key) => (
              <label
                key={key}
                className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-[#c12d58]/20 hover:shadow transition-all"
              >
                <span className="capitalize text-gray-800 font-medium">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <input
                  type="checkbox"
                  checked={config.sections[key]}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      sections: {
                        ...config.sections,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 accent-[#c12d58] cursor-pointer"
                />
              </label>
            ))}
          </div>
        </section>

        {/* 🔹 Featured Fabrics */}
        <section className="border-l-4 border-[#003466] bg-[#f6f9ff] rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#003466] mb-4 flex items-center gap-2">
            Featured Fabrics (Slug)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(config.homePage?.fabricsSection?.featuredFabrics || []).map(
              (slug, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white border border-[#003466]/20 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition"
                >
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      const updated = [
                        ...config.homePage.fabricsSection.featuredFabrics,
                      ];
                      updated[idx] = e.target.value;
                      setConfig({
                        ...config,
                        homePage: {
                          ...config.homePage,
                          fabricsSection: {
                            ...config.homePage.fabricsSection,
                            featuredFabrics: updated,
                          },
                        },
                      });
                    }}
                    className="w-full text-gray-700 font-medium outline-none bg-transparent"
                    placeholder="fabric-slug"
                  />
                  <button
                    onClick={() => {
                      const updated =
                        config.homePage.fabricsSection.featuredFabrics.filter(
                          (_, i) => i !== idx
                        );
                      setConfig({
                        ...config,
                        homePage: {
                          ...config.homePage,
                          fabricsSection: {
                            ...config.homePage.fabricsSection,
                            featuredFabrics: updated,
                          },
                        },
                      });
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            )}
          </div>
          <button
            onClick={() =>
              setConfig({
                ...config,
                homePage: {
                  ...config.homePage,
                  fabricsSection: {
                    ...config.homePage.fabricsSection,
                    featuredFabrics: [
                      ...(config.homePage.fabricsSection.featuredFabrics || []),
                      "",
                    ],
                  },
                },
              })
            }
            className="mt-3 flex items-center gap-2 text-[#003466] font-semibold hover:text-[#002850] transition"
          >
            <PlusCircle size={18} /> Add Fabric
          </button>
        </section>

        {/* 🔹 Featured Boutiques */}
        <section className="border-l-4 border-[#ffc1cc] bg-[#fff7fa] rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#c12d58] mb-4 flex items-center gap-2">
            Featured Boutiques
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(config.homePage?.boutiquesSection?.featuredBoutiques || []).map(
              (id, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white border border-[#ffc1cc]/40 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition"
                >
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => {
                      const updated = [
                        ...config.homePage.boutiquesSection.featuredBoutiques,
                      ];
                      updated[idx] = e.target.value;
                      setConfig({
                        ...config,
                        homePage: {
                          ...config.homePage,
                          boutiquesSection: {
                            ...config.homePage.boutiquesSection,
                            featuredBoutiques: updated,
                          },
                        },
                      });
                    }}
                    className="w-full text-gray-700 font-medium outline-none bg-transparent"
                    placeholder="Boutique ID or slug"
                  />
                  <button
                    onClick={() => {
                      const updated =
                        config.homePage.boutiquesSection.featuredBoutiques.filter(
                          (_, i) => i !== idx
                        );
                      setConfig({
                        ...config,
                        homePage: {
                          ...config.homePage,
                          boutiquesSection: {
                            ...config.homePage.boutiquesSection,
                            featuredBoutiques: updated,
                          },
                        },
                      });
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            )}
          </div>
          <button
            onClick={() =>
              setConfig({
                ...config,
                homePage: {
                  ...config.homePage,
                  boutiquesSection: {
                    ...config.homePage.boutiquesSection,
                    featuredBoutiques: [
                      ...(config.homePage.boutiquesSection.featuredBoutiques ||
                        []),
                      "",
                    ],
                  },
                },
              })
            }
            className="mt-3 flex items-center gap-2 text-[#c12d58] font-semibold hover:text-[#a31f47] transition"
          >
            <PlusCircle size={18} /> Add Boutique
          </button>
        </section>

        {/* 🔹 Home Banners */}
        <section className="border-l-4 border-[#003466] bg-[#f5f8ff] rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#003466] mb-4 flex items-center gap-2">
            🖼️ Home Page Banners
          </h2>

          {(config.homePage?.banners || []).map((b, i) => (
            <div
              key={i}
              className="border border-[#003466]/20 rounded-xl p-4 mb-4 bg-white relative shadow-sm hover:shadow-md transition"
            >
              <button
                onClick={() => {
                  const updated = config.homePage.banners.filter(
                    (_, idx) => idx !== i
                  );
                  setConfig({
                    ...config,
                    homePage: { ...config.homePage, banners: updated },
                  });
                }}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>

              {/* IMAGE UPLOADER HERE */}
              <ImageUploader
                value={b.image}
                onChange={(url) => {
                  const updated = [...config.homePage.banners];
                  updated[i].image = url;
                  setConfig({
                    ...config,
                    homePage: { ...config.homePage, banners: updated },
                  });
                }}
              />

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {["heading", "subheading", "buttonText", "buttonLink"].map(
                  (field) => (
                    <input
                      key={field}
                      type="text"
                      value={b[field]}
                      onChange={(e) => {
                        const updated = [...config.homePage.banners];
                        updated[i][field] = e.target.value;
                        setConfig({
                          ...config,
                          homePage: { ...config.homePage, banners: updated },
                        });
                      }}
                      placeholder={`Banner ${field}`}
                      className="border border-[#003466]/20 p-2 rounded-md text-gray-700 font-medium focus:ring-2 focus:ring-[#003466]/40 outline-none"
                    />
                  )
                )}
              </div>
            </div>
          ))}

          {/* Add banner */}
          <button
            onClick={() =>
              setConfig({
                ...config,
                homePage: {
                  ...config.homePage,
                  banners: [
                    ...(config.homePage.banners || []),
                    {
                      image: "",
                      heading: "",
                      subheading: "",
                      buttonText: "",
                      buttonLink: "",
                      visible: true,
                    },
                  ],
                },
              })
            }
            className="flex items-center gap-2 text-[#003466] font-semibold hover:text-[#002850] transition"
          >
            <PlusCircle size={18} /> Add Banner
          </button>
        </section>

        {/* 🔹 Save Button */}
        <div className="text-center pt-6">
          <button
            onClick={saveConfig}
            disabled={saving}
            className="px-10 py-4 bg-gradient-to-r from-[#003466] to-[#002850] text-white rounded-full font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 justify-center mx-auto shadow-md"
          >
            {saving && <Loader2 size={18} className="animate-spin" />}
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
