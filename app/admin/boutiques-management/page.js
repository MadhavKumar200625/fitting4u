"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit, Trash, CheckCircle, XCircle, Search } from "lucide-react";

export default function BoutiquesManagement() {
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBoutiques = useCallback(async (nextPage = 1, searchTerm = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: "20",
        search: searchTerm,
      });
      const res = await fetch(`/api/boutiques?${params.toString()}`);
      const data = await res.json();
      setBoutiques(data.boutiques || []);
      setPage(data.page || nextPage);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoutiques(1, "");
  }, [fetchBoutiques]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBoutiques(1, search);
  };

  const deleteBoutique = async (id) => {
    if (!confirm("Delete this boutique?")) return;
    await fetch(`/api/boutiques/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
      },
    });
    setBoutiques(boutiques.filter((b) => b._id !== id));
  };

  const handleBulkUpload = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const token =
    sessionStorage.getItem("admin_auth") ||
    localStorage.getItem("admin_auth");

  const res = await fetch("/api/admin/boutiques/bulk-upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!data.success) {
    alert(data.message || "Upload failed");
    return;
  }

  alert(`✅ ${data.inserted} boutiques uploaded`);
  fetchBoutiques(1, search);
};

  return (
    <section className="min-h-screen bg-[#fff] pb-20 pt-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
       <div className="flex flex-wrap gap-4 justify-between items-center mb-12">
  <h1 className="text-4xl font-bold text-black">Boutiques</h1>

  <div className="flex gap-3">
    {/* BULK UPLOAD */}
    <label className="cursor-pointer flex items-center gap-2 border border-black text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100">
      Upload CSV
      <input
        type="file"
        accept=".csv"
        hidden
        onChange={(e) => handleBulkUpload(e.target.files[0])}
      />
    </label>

    {/* ADD SINGLE */}
    <Link
      href="/admin/boutiques-management/add"
      className="flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-primary)] px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg"
    >
      <Plus size={20} />
      Add Boutique
    </Link>
  </div>
</div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search boutiques..."
            className="border border-gray-200 rounded-full px-5 py-3 w-full max-w-md text-black focus:outline-none focus:ring-2 focus:ring-[#003466]"
          />
          <button
            type="submit"
            className="bg-[#003466] text-white px-5 py-3 rounded-full hover:bg-[#002850]"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-3xl shadow-md border border-gray-100">
          <table className="w-full text-left text-gray-800">
            <thead className="bg-gray-50 text-gray-900 text-sm font-semibold">
              <tr>
                <th className="py-4 px-6">Title</th>
                <th className="px-6">Type</th>
                <th className="px-6">Price Range</th>
                <th className="px-6">Verified</th>
                <th className="px-6">Status</th>
                <th className="px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : boutiques.length > 0 ? (
                boutiques.map((b) => (
                  <tr
                    key={b._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={b.businessLogo || "/no-logo.png"}
                        alt="Logo"
                        className="w-10 h-10 rounded-full border"
                      />
                      {b.title}
                    </td>
                    <td className="px-6">{b.type}</td>
                    <td className="px-6">{b.priceRange}</td>
                    <td className="px-6">
                      {b.verified ? (
                        <CheckCircle className="text-green-500" />
                      ) : (
                        <XCircle className="text-gray-400" />
                      )}
                    </td>
                    <td className="px-6">{b.status}</td>
                    <td className="px-6 text-right flex gap-3 justify-end">
                      <Link
                        href={`/admin/boutiques-management/edit/${b._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => deleteBoutique(b._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No boutiques found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-end gap-3 mt-6 text-black">
            <button
              onClick={() => fetchBoutiques(page - 1, search)}
              disabled={page <= 1}
              className="px-4 py-2 border border-gray-200 rounded-full disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => fetchBoutiques(page + 1, search)}
              disabled={page >= totalPages}
              className="px-4 py-2 border border-gray-200 rounded-full disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
