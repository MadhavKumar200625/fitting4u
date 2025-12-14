"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Plus, Trash2, Upload } from "lucide-react";

export default function AddFabric() {
  const router = useRouter();
  const [form, setForm] = useState({
    collectionName: "",
    name: "",
    slug: "",
    images: [],
    price: "",
    customerPrice: "",
    boutiquePrice: "",
    stockLeft: "",
    width: "",
    material: "",
    weave: "",
    color: "",
    description: "",
    careInstructions: [""],
    faqs: [{ question: "", answer: "" }],
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [""],
    },
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSeoChange = (e) =>
    setForm({ ...form, seo: { ...form.seo, [e.target.name]: e.target.value } });

  const updateArrayField = (field, index, value) => {
    const arr = [...form[field]];
    arr[index] = value;
    setForm({ ...form, [field]: arr });
  };

  const addArrayItem = (field, emptyValue) =>
    setForm({ ...form, [field]: [...form[field], emptyValue] });

  const removeArrayItem = (field, index) => {
    const arr = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: arr });
  };

  const updateFaq = (index, key, value) => {
    const faqs = [...form.faqs];
    faqs[index][key] = value;
    setForm({ ...form, faqs });
  };

  const handleImageDelete = async (imageUrl, index) => {
  try {
    const url = new URL(imageUrl);
    // Example: fabrics/slug/1.png
    const fileKey = decodeURIComponent(url.pathname.replace(/^\/+/, ""));

    const res = await fetch(`/api/upload?key=${encodeURIComponent(fileKey)}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete image");

    // Update local state (remove image from form)
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    toast.success("Image deleted successfully");
  } catch (err) {
    console.error("Delete failed:", err);
    toast.error("Failed to delete image");
  }
};


const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  if (!form.slug) {
    toast.error("Please enter a fabric slug before uploading images.");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop().toLowerCase();
    const nextIndex = form.images.length + i + 1;

    const fileName = `fabrics/${form.slug}/${nextIndex}.${ext}`;

    try {
      // 1️⃣ Get presigned URL
      const res = await fetch(
        `/api/upload?fileName=${encodeURIComponent(fileName)}&contentType=${file.type}`
      );

      if (!res.ok) throw new Error("Failed to get URL");

      const { uploadUrl, publicUrl } = await res.json();

      // 2️⃣ Upload with progress using XMLHttpRequest
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);

            setUploadProgress((prev) => ({
              ...prev,
              [fileName]: percent,
            }));
          }
        });

        xhr.onload = () => {
          if (xhr.status === 200) resolve();
          else reject("Upload failed");
        };

        xhr.onerror = () => reject("Upload error");

        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      // 3️⃣ Add image to state immediately
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, publicUrl],
      }));

      toast.success(`${file.name} uploaded`);
    } catch (err) {
      toast.error(`Failed: ${file.name}`);
    }
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/fabrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Fabric added successfully!");
      router.push("/admin/fabric-management");
    } else {
      const error = await res.text();
      toast.error(`Failed to add fabric: ${error}`);
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen mt-24 bg-[#f9fafc] p-8 font-[Poppins] text-black">
      <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-2xl p-8 border border-neutral-100">
        <h1 className="text-3xl font-bold text-[#003466] mb-8">Add New Fabric</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* === BASIC INFO === */}
          {[
            "collectionName",
            "name",
            "slug",
            "price",
            "customerPrice",
            "boutiquePrice",
            "stockLeft",
            "width",
            "material",
            "weave",
            "color",
          ].map((key) => (
            <div key={key}>
              <label className="block mb-1 font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={
                  ["price", "customerPrice", "boutiquePrice", "stockLeft", "width"].includes(key)
                    ? "number"
                    : "text"
                }
                name={key}
                value={form[key]}
                onChange={handleChange}
                required
                className="border border-neutral-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#003466]"
              />
            </div>
          ))}

          {/* === DESCRIPTION === */}
          <div className="sm:col-span-2">
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              required
              className="border border-neutral-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#003466]"
            />
          </div>

          {/* === STATUS === */}
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border border-neutral-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#003466]"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Draft</option>
            </select>
          </div>

          {/* === IMAGES UPLOAD === */}
          <div className="sm:col-span-2">
            <label className="block mb-2 font-medium">Images</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt={`fabric-${i}`}
                    className="w-28 h-28 object-cover rounded-lg border border-neutral-200 shadow-sm"
                  />
                  <button
  type="button"
  onClick={() => handleImageDelete(url, i)}
  className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
>
  ✕
</button>
                   
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <label className="cursor-pointer bg-[#003466] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#002850] transition">
                <Upload size={18} />
                {uploading ? "Uploading..." : "Upload Images"}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-neutral-500">
                You can upload multiple images at once
              </p>
            </div>
          </div>

          {/* === CARE INSTRUCTIONS === */}
          <div className="sm:col-span-2">
            <label className="block mb-2 font-medium">Care Instructions</label>
            {form.careInstructions.map((inst, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={inst}
                  onChange={(e) => updateArrayField("careInstructions", i, e.target.value)}
                  placeholder="e.g. Dry clean recommended"
                  className="border border-neutral-300 rounded-lg px-3 py-2 w-full"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("careInstructions", i)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("careInstructions", "")}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Instruction
            </button>
          </div>

          {/* === FAQ === */}
          <div className="sm:col-span-2">
            <label className="block mb-2 font-medium">FAQs</label>
            {form.faqs.map((faq, i) => (
              <div key={i} className="mb-3 border p-3 rounded-lg border-neutral-200">
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => updateFaq(i, "question", e.target.value)}
                  className="border border-neutral-300 rounded-lg px-3 py-2 w-full mb-2"
                />
                <textarea
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => updateFaq(i, "answer", e.target.value)}
                  className="border border-neutral-300 rounded-lg px-3 py-2 w-full"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("faqs", i)}
                  className="text-red-600 hover:text-red-800 mt-2 text-sm"
                >
                  Remove FAQ
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("faqs", { question: "", answer: "" })}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add FAQ
            </button>
          </div>

          {/* === SEO === */}
          <div className="sm:col-span-2 border-t border-neutral-200 pt-6 mt-4">
            <h2 className="text-xl font-semibold mb-3 text-[#003466]">SEO Details</h2>
            <label className="block mb-1 font-medium">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={form.seo.metaTitle}
              onChange={handleSeoChange}
              className="border border-neutral-300 rounded-lg px-3 py-2 w-full mb-3"
            />

            <label className="block mb-1 font-medium">Meta Description</label>
            <textarea
              name="metaDescription"
              value={form.seo.metaDescription}
              onChange={handleSeoChange}
              className="border border-neutral-300 rounded-lg px-3 py-2 w-full mb-3"
            />

            <label className="block mb-1 font-medium">Keywords</label>
            {form.seo.keywords.map((kw, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={kw}
                  onChange={(e) => {
                    const arr = [...form.seo.keywords];
                    arr[i] = e.target.value;
                    setForm({ ...form, seo: { ...form.seo, keywords: arr } });
                  }}
                  className="border border-neutral-300 rounded-lg px-3 py-2 w-full"
                />
                <button
                  type="button"
                  onClick={() => {
                    const arr = form.seo.keywords.filter((_, j) => j !== i);
                    setForm({ ...form, seo: { ...form.seo, keywords: arr } });
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  seo: { ...form.seo, keywords: [...form.seo.keywords, ""] },
                })
              }
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Keyword
            </button>
          </div>

          {/* === SUBMIT === */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-[#003466] text-white px-8 py-3 rounded-lg shadow-md hover:bg-[#002850] sm:col-span-2 mt-6"
          >
            {loading ? "Adding..." : "Add Fabric"}
          </button>
        </form>
      </div>
    </section>
  );
}