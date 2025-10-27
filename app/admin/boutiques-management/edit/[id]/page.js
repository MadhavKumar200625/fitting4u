"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";

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
    businessHours: [
      { day: "Monday", open: "", close: "", isClosed: false },
      { day: "Tuesday", open: "", close: "", isClosed: false },
      { day: "Wednesday", open: "", close: "", isClosed: false },
      { day: "Thursday", open: "", close: "", isClosed: false },
      { day: "Friday", open: "", close: "", isClosed: false },
      { day: "Saturday", open: "", close: "", isClosed: false },
      { day: "Sunday", open: "", close: "", isClosed: false },
    ],
  });

  // ✅ Load existing boutique
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/boutiques/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
          },
        });
        const data = await res.json();
        if (res.ok) setFormData(data);
        else console.error("Failed to load boutique:", data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "verified") {
      setFormData((p) => ({ ...p, verified: checked }));
      return;
    }

    const [group, key] = name.split(".");
    if (key) setFormData((p) => ({ ...p, [group]: { ...p[group], [key]: value } }));
    else setFormData((p) => ({ ...p, [name]: value }));
  };

  // ✅ Upload handler
  const handleImageUpload = async (e, field) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (!formData.websiteUrl) return alert("Enter Website Slug first");

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop().toLowerCase();
        if (!["png", "webp"].includes(ext)) continue;

        let fileName = "";
        if (field === "businessLogo")
          fileName = `${formData.websiteUrl.trim().toLowerCase()}/logo.${ext}`;
        else {
          const nextIndex = formData.imageGallery.length + (i + 1);
          fileName = `${formData.websiteUrl.trim().toLowerCase()}/image-gallery/${nextIndex}.${ext}`;
        }

        const res = await fetch(
          `/api/upload?fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(file.type)}`
        );
        const { uploadUrl, publicUrl } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!uploadRes.ok) throw new Error("S3 upload failed");

        if (field === "businessLogo") {
          setFormData((p) => ({
            ...p,
            businessLogo: `${publicUrl}?v=${Date.now()}`, // cache-buster
          }));
        } else {
          setFormData((p) => ({
            ...p,
            imageGallery: [...p.imageGallery, publicUrl],
          }));
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index) => {
    const imageUrl = formData.imageGallery[index];
    const key = imageUrl.split(".com/")[1];
    if (!key) return;
    await fetch(`/api/upload?key=${encodeURIComponent(key)}`, { method: "DELETE" });
    setFormData((p) => ({
      ...p,
      imageGallery: p.imageGallery.filter((_, i) => i !== index),
    }));
  };

  const removeLogo = async () => {
    if (!formData.businessLogo) return;
    const key = formData.businessLogo.split(".com/")[1];
    await fetch(`/api/upload?key=${encodeURIComponent(key)}`, { method: "DELETE" });
    setFormData((p) => ({ ...p, businessLogo: "" }));
  };

  // ✅ Update form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/boutiques/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
      },
      body: JSON.stringify(formData),
    });
    if (res.ok) router.push("/admin/boutiques-management");
    else alert("Update failed");
  };

  // FAQ controls
  const addFAQ = () =>
    setFormData((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }));

  const updateFAQ = (i, key, val) => {
    const updated = [...formData.faqs];
    updated[i][key] = val;
    setFormData((p) => ({ ...p, faqs: updated }));
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
                <div key={i} className="flex items-center gap-3">
                  <span className="w-24 font-medium">{bh.day}</span>
                  <input
                    type="time"
                    value={bh.open}
                    onChange={(e) => {
                      const u = [...formData.businessHours];
                      u[i].open = e.target.value;
                      setFormData((p) => ({ ...p, businessHours: u }));
                    }}
                    className="p-2 border rounded-lg"
                    disabled={bh.isClosed}
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={bh.close}
                    onChange={(e) => {
                      const u = [...formData.businessHours];
                      u[i].close = e.target.value;
                      setFormData((p) => ({ ...p, businessHours: u }));
                    }}
                    className="p-2 border rounded-lg"
                    disabled={bh.isClosed}
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