"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyBusinessHours = DAYS.map((day) => ({
  day,
  open: "",
  close: "",
  isClosed: false,
}));

export default function EditBoutique() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    seo: { metaTitle: "", metaDescription: "", keywords: "" },
    googleAddress: "",
    lat: "",
    long: "",
    phoneNumber: "",
    whatsappNumber: "",
    email: "",
    websiteUrl: "",
    socialLinks: { x: "", facebook: "", linkedin: "", youtube: "" },
    imageGallery: [],
    businessLogo: "",
    videoUrl: "",
    priceRange: "Medium",
    verified: false,
    type: "Unisex",
    status: "Active",
    faqs: [{ question: "", answer: "" }],
    businessHours: emptyBusinessHours,
  });

  /* ----------------------------------------
     LOAD & NORMALIZE DATA
  -----------------------------------------*/
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`/api/boutiques/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Fetch failed");

        // ✅ Normalize business hours
        const bhMap = {};
        (data.businessHours || []).forEach((b) => {
          bhMap[b.day] = b;
        });

        const normalizedBH = DAYS.map((day) => ({
          day,
          open: bhMap[day]?.open || "",
          close: bhMap[day]?.close || "",
          isClosed: bhMap[day]?.isClosed || false,
        }));

        setFormData({
          ...data,
          lat: data.lat?.toString() || "",
          long: data.long?.toString() || "",
          seo: {
            ...data.seo,
            keywords: Array.isArray(data.seo?.keywords)
              ? data.seo.keywords.join(", ")
              : "",
          },
          businessHours: normalizedBH,
          faqs: data.faqs?.length ? data.faqs : [{ question: "", answer: "" }],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ----------------------------------------
     GENERIC CHANGE HANDLER
  -----------------------------------------*/
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "verified") {
      setFormData((p) => ({ ...p, verified: checked }));
      return;
    }

    const [group, key] = name.split(".");
    if (key) {
      setFormData((p) => ({
        ...p,
        [group]: { ...p[group], [key]: value },
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  /* ----------------------------------------
     SUBMIT (FIXED PAYLOAD)
  -----------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      lat: Number(formData.lat),
      long: Number(formData.long),
      seo: {
        ...formData.seo,
        keywords: formData.seo.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      },
      location: {
        type: "Point",
        coordinates: [
          Number(formData.long),
          Number(formData.lat),
        ],
      },
    };

    const res = await fetch(`/api/boutiques/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) router.push("/admin/boutiques-management");
    else alert("Update failed");
  };

  /* ----------------------------------------
     FAQ HELPERS (UNCHANGED)
  -----------------------------------------*/
  const addFAQ = () =>
    setFormData((p) => ({
      ...p,
      faqs: [...p.faqs, { question: "", answer: "" }],
    }));

  const updateFAQ = (i, key, val) => {
    const u = [...formData.faqs];
    u[i][key] = val;
    setFormData((p) => ({ ...p, faqs: u }));
  };

  const removeFAQ = (i) =>
    setFormData((p) => ({
      ...p,
      faqs: p.faqs.filter((_, idx) => idx !== i),
    }));

  if (loading)
    return <p className="text-center text-gray-500 mt-20">Loading boutique...</p>;

  return (
    <section className="min-h-screen bg-white pb-20 pt-32 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Edit Boutique</h1>

        <form onSubmit={handleSubmit} className="space-y-8 text-gray-900">
          {/* BASIC INFO */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="p-3 border rounded-xl bg-gray-50"
            />
            <input
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Tagline"
              className="p-3 border rounded-xl bg-gray-50"
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 border rounded-xl bg-gray-50"
            rows={4}
          />

          {/* SEO */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">SEO Metadata</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="seo.metaTitle"
                value={formData.seo.metaTitle}
                onChange={handleChange}
                placeholder="Meta Title"
                className="p-3 border rounded-xl bg-gray-50"
              />
              <input
                name="seo.metaDescription"
                value={formData.seo.metaDescription}
                onChange={handleChange}
                placeholder="Meta Description"
                className="p-3 border rounded-xl bg-gray-50"
              />
            </div>
            <input
              name="seo.keywords"
              value={formData.seo.keywords}
              onChange={handleChange}
              placeholder="Keywords (comma separated)"
              className="mt-4 p-3 border rounded-xl bg-gray-50 w-full"
            />
          </div>

          {/* LOCATION */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="googleAddress"
              value={formData.googleAddress}
              onChange={handleChange}
              placeholder="Google Address"
              className="p-3 border rounded-xl bg-gray-50"
            />
            <input
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="Website Slug"
              className="p-3 border rounded-xl bg-gray-50"
            />
          </div>

          {/* COORDINATES */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              placeholder="Latitude"
              className="p-3 border rounded-xl bg-gray-50"
            />
            <input
              name="long"
              value={formData.long}
              onChange={handleChange}
              placeholder="Longitude"
              className="p-3 border rounded-xl bg-gray-50"
            />
          </div>

          {/* CONTACT */}
          <div className="grid sm:grid-cols-3 gap-4">
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="p-3 border rounded-xl bg-gray-50"
            />
            <input
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="WhatsApp Number"
              className="p-3 border rounded-xl bg-gray-50"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 border rounded-xl bg-gray-50"
            />
          </div>

          {/* LOGO */}
          <div className="border border-dashed border-gray-300 rounded-xl p-6">
            <p className="font-medium mb-2">Upload Boutique Logo (PNG/WEBP)</p>
            <input
              type="file"
              accept="image/png, image/webp"
              onChange={(e) => handleImageUpload(e, "businessLogo")}
            />
            {formData.businessLogo && (
              <div className="relative inline-block mt-4">
                <img
                  src={formData.businessLogo}
                  alt="Logo"
                  className="w-24 h-24 object-cover rounded-xl border"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {/* GALLERY */}
          <div className="border border-dashed border-gray-300 rounded-xl p-6">
            <p className="font-medium mb-2">Upload Gallery Images</p>
            <input
              type="file"
              multiple
              accept="image/png, image/webp"
              onChange={(e) => handleImageUpload(e, "imageGallery")}
            />
            {uploading && <p className="text-sm mt-2">Uploading...</p>}
            <div className="flex gap-3 mt-4 flex-wrap">
              {formData.imageGallery.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt=""
                    className="w-24 h-24 object-cover rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* VIDEO */}
          <input
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="YouTube Video URL"
            className="p-3 border rounded-xl bg-gray-50 w-full"
          />

          {/* VERIFIED */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="verified"
              checked={formData.verified}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-700">Verified Boutique</label>
          </div>

          {/* BUSINESS HOURS */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <div className="space-y-3">
              {formData.businessHours.map((bh, i) => (
                <div key={bh.day} className="flex items-center gap-3">
                  <span className="w-24 font-medium">{bh.day}</span>

                  <input
                    type="time"
                    value={bh.open}
                    disabled={bh.isClosed}
                    onChange={(e) => {
                      const u = [...formData.businessHours];
                      u[i].open = e.target.value;
                      setFormData((p) => ({ ...p, businessHours: u }));
                    }}
                    className="p-2 border rounded-lg"
                  />

                  <span>to</span>

                  <input
                    type="time"
                    value={bh.close}
                    disabled={bh.isClosed}
                    onChange={(e) => {
                      const u = [...formData.businessHours];
                      u[i].close = e.target.value;
                      setFormData((p) => ({ ...p, businessHours: u }));
                    }}
                    className="p-2 border rounded-lg"
                  />

                  <label className="flex items-center gap-1 ml-2">
                    <input
                      type="checkbox"
                      checked={bh.isClosed}
                      onChange={(e) => {
                        const u = [...formData.businessHours];
                        u[i].isClosed = e.target.checked;
                        setFormData((p) => ({ ...p, businessHours: u }));
                      }}
                    />
                    <span className="text-sm">Closed</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">FAQs</h3>
              <button
                type="button"
                onClick={addFAQ}
                className="text-sm text-blue-600 flex items-center gap-1"
              >
                <Plus size={14} /> Add FAQ
              </button>
            </div>
            {formData.faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 mb-3 bg-gray-50">
                <input
                  value={faq.question}
                  onChange={(e) => updateFAQ(i, "question", e.target.value)}
                  placeholder="Question"
                  className="w-full p-2 border rounded mb-2"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(i, "answer", e.target.value)}
                  placeholder="Answer"
                  className="w-full p-2 border rounded"
                ></textarea>
                <button
                  type="button"
                  onClick={() => removeFAQ(i)}
                  className="text-red-600 text-sm mt-2 flex items-center gap-1"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold rounded-full shadow hover:shadow-lg transition"
            >
              Update Boutique
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}