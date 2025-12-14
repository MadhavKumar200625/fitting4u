"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Plus, Trash2, X } from "lucide-react";

export default function AddBoutique() {
  const router = useRouter();

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

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [group, key] = name.split(".");
    if (key) {
      setFormData((p) => ({ ...p, [group]: { ...p[group], [key]: value } }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleImageUpload = async (e, field) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (!formData.websiteUrl) {
      alert("Please enter the Website Slug before uploading images.");
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop().toLowerCase();

        if (!["png", "webp"].includes(ext)) {
          alert("Only PNG and WEBP files are allowed.");
          continue;
        }

        let fileName = "";

        if (field === "businessLogo") {
          // ✅ slug/logo.png
          fileName = `${formData.websiteUrl.trim().toLowerCase()}/logo.${ext}`;
        } else {
          // ✅ slug/image-gallery/1.png, 2.png, etc.
          const nextIndex = formData.imageGallery.length + (i + 1);
          fileName = `${formData.websiteUrl
            .trim()
            .toLowerCase()}/image-gallery/${nextIndex}.${ext}`;
        }

        const res = await fetch(
          `/api/upload?fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(file.type)}`
        );

        if (!res.ok) throw new Error("Failed to get presigned URL");

        const { uploadUrl, publicUrl } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadRes.ok) throw new Error("upload failed");

        if (field === "businessLogo") {
          setFormData((prev) => ({ ...prev, businessLogo: publicUrl }));
        } else {
          setFormData((prev) => ({
            ...prev,
            imageGallery: [...prev.imageGallery, publicUrl],
          }));
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index) => {
    const imageUrl = formData.imageGallery[index];
    const key = imageUrl.split(".com/")[1]; // everything after bucket/
    if (!key) return;

    await fetch(`/api/upload?key=${encodeURIComponent(key)}`, { method: "DELETE" });

    setFormData((prev) => ({
      ...prev,
      imageGallery: prev.imageGallery.filter((_, i) => i !== index),
    }));
  };

  const removeLogo = async () => {
    if (!formData.businessLogo) return;
    const key = formData.businessLogo.split(".com/")[1];
    await fetch(`/api/upload?key=${encodeURIComponent(key)}`, { method: "DELETE" });
    setFormData((prev) => ({ ...prev, businessLogo: "" }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/boutiques", {
      method: "POST",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`
       },
      
      body: JSON.stringify(formData),
    });
    if (res.ok) router.push("/admin/boutiques-management");
    else alert("Failed to save boutique");
  };

  // ✅ FAQ Handlers
  const addFAQ = () =>
    setFormData((p) => ({
      ...p,
      faqs: [...p.faqs, { question: "", answer: "" }],
    }));

  const updateFAQ = (i, key, value) => {
    const updated = [...formData.faqs];
    updated[i][key] = value;
    setFormData((p) => ({ ...p, faqs: updated }));
  };

  const removeFAQ = (i) =>
    setFormData((p) => ({
      ...p,
      faqs: p.faqs.filter((_, idx) => idx !== i),
    }));

  return (
    <section className="min-h-screen bg-white pb-20 pt-32 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Add New Boutique
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 text-gray-900">
          {/* === BASIC INFO === */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Title"
              required
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
              onChange={handleChange}
            />
            <input
              name="tagline"
              placeholder="Tagline"
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
              onChange={handleChange}
            />
          </div>

          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-3 border rounded-xl bg-gray-50 text-gray-900"
            rows={4}
            onChange={handleChange}
          ></textarea>

          {/* === SEO === */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">SEO Metadata</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="seo.metaTitle"
                placeholder="Meta Title"
                onChange={handleChange}
                className="p-3 border rounded-xl bg-gray-50 text-gray-900"
              />
              <input
                name="seo.metaDescription"
                placeholder="Meta Description"
                onChange={handleChange}
                className="p-3 border rounded-xl bg-gray-50 text-gray-900"
              />
            </div>
            <input
              name="seo.keywords"
              placeholder="Keywords (comma separated)"
              onChange={handleChange}
              className="mt-4 p-3 border rounded-xl bg-gray-50 text-gray-900 w-full"
            />
          </div>

          {/* === LOCATION === */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="googleAddress"
              placeholder="Google Address"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            />
            <input
              name="websiteUrl"
              placeholder="Website Slug"
              required
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              name="lat"
              placeholder="Latitude"
              type="number"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            />
            <input
              name="long"
              placeholder="Longitude"
              type="number"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            />
          </div>

          {/* === CONTACT === */}
          <div className="grid sm:grid-cols-3 gap-4">
            <input
              name="phoneNumber"
              placeholder="Phone Number"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            />
            <input
              name="whatsappNumber"
              placeholder="WhatsApp Number"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            />
            <input
              name="email"
              placeholder="Email"
              type="email"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            />
          </div>

          {/* === SOCIAL === */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <input
              name="socialLinks.x"
              placeholder="X (Twitter)"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            />
            <input
              name="socialLinks.facebook"
              placeholder="Facebook"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            />
            <input
              name="socialLinks.linkedin"
              placeholder="LinkedIn"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            />
            <input
              name="socialLinks.youtube"
              placeholder="YouTube"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            />
          </div>

          {/* === LOGO === */}
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

          {/* === GALLERY === */}
          <div className="border border-dashed border-gray-300 rounded-xl p-6">
            <p className="font-medium mb-2">Upload Gallery Images (PNG/WEBP)</p>
            <input
              type="file"
              multiple
              accept="image/png, image/webp"
              onChange={(e) => handleImageUpload(e, "imageGallery")}
            />
            {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}

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
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* === VIDEO === */}
          <input
            name="videoUrl"
            placeholder="YouTube Video URL"
            onChange={handleChange}
            className="p-3 border rounded-xl bg-gray-50 text-gray-900 w-full"
          />

          {/* === TYPE / PRICE / STATUS === */}
          <div className="grid sm:grid-cols-3 gap-4">
            <select
              name="type"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            >
              <option>Men</option>
              <option>Women</option>
              <option>Unisex</option>
            </select>

            <select
              name="priceRange"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Luxury</option>
            </select>

            <select
              name="status"
              onChange={handleChange}
              className="p-3 border rounded-xl bg-gray-50 text-gray-900"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Draft</option>
            </select>

            <div className="flex items-center gap-2">
  <input
    type="checkbox"
    name="verified"
    checked={formData.verified}
    onChange={(e) => setFormData((p) => ({ ...p, verified: e.target.checked }))}
    className="w-4 h-4"
  />
  <label className="text-sm text-gray-700">Verified Boutique</label>
</div>
          </div>

          {/* === FAQ === */}
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
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 mb-3 bg-gray-50"
              >
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
            const updated = [...formData.businessHours];
            updated[i].open = e.target.value;
            setFormData((p) => ({ ...p, businessHours: updated }));
          }}
          className="p-2 border rounded-lg"
          disabled={bh.isClosed}
        />
        <span>to</span>
        <input
          type="time"
          value={bh.close}
          onChange={(e) => {
            const updated = [...formData.businessHours];
            updated[i].close = e.target.value;
            setFormData((p) => ({ ...p, businessHours: updated }));
          }}
          className="p-2 border rounded-lg"
          disabled={bh.isClosed}
        />
        <label className="flex items-center gap-1 ml-2">
          <input
            type="checkbox"
            checked={bh.isClosed}
            onChange={(e) => {
              const updated = [...formData.businessHours];
              updated[i].isClosed = e.target.checked;
              setFormData((p) => ({ ...p, businessHours: updated }));
            }}
          />
          <span className="text-sm">Closed</span>
        </label>
      </div>
    ))}
  </div>
</div>

          {/* === SUBMIT === */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold rounded-full shadow hover:shadow-lg transition"
            >
              Save Boutique
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}