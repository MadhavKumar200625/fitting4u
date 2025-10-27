"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Edit, Trash, CheckCircle, XCircle } from "lucide-react";

export default function BoutiquesManagement() {
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBoutiques = async () => {
    try {
      const res = await fetch("/api/boutiques");
      const data = await res.json();
      setBoutiques(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoutiques();
  }, []);

  const deleteBoutique = async (id) => {
    if (!confirm("Delete this boutique?")) return;
    await fetch(`/api/boutiques/${id}`, {
      method: "DELETE",
    });
    setBoutiques(boutiques.filter((b) => b._id !== id));
  };

  return (
    <section className="min-h-screen bg-[#fff] pb-20 pt-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Boutiques</h1>
          <Link
            href="/admin/boutiques-management/add"
            className="flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-primary)] px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Add Boutique
          </Link>
        </div>

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
      </div>
    </section>
  );
}