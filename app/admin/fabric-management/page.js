"use client";

import { useEffect, useState } from "react";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function FabricsList() {
  const [fabrics, setFabrics] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchFabrics = async () => {
    setLoading(true);
    const res = await fetch(`/api/fabrics?search=${search}`);
    const data = await res.json();
    setFabrics(data.fabrics || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFabrics();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this fabric?")) return;
    const res = await fetch(`/api/fabrics/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Fabric deleted");
      fetchFabrics();
    } else toast.error("Failed to delete");
  };

  return (
    <section className="min-h-screen pt-32 bg-[#f9fafc] p-8 font-[Poppins]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#003466]">All Fabrics</h1>
          <Link
            href="/admin/fabric-management/add"
            className="bg-[#003466] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#002850] transition"
          >
            <Plus size={18} /> Add Fabric
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fabrics..."
            className="border border-neutral-300 rounded-lg px-4 py-2 w-full max-w-md focus:ring-2 focus:ring-[#003466] outline-none"
          />
          <button
            onClick={fetchFabrics}
            className="bg-[#003466] text-white px-4 py-2 rounded-lg hover:bg-[#002850]"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading fabrics...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-neutral-100">
            <table className="min-w-full text-left text-sm">
              <thead className=" text-black">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Collection</th>
                  <th className="py-3 px-4">Material</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fabrics.map((f) => (
                  <tr
                    key={f._id}
                    className="border-b text-black border-neutral-100 hover:bg-neutral-50"
                  >
                    <td className="py-3 px-4 font-medium">{f.name}</td>
                    <td className="py-3 px-4">{f.collectionName}</td>
                    <td className="py-3 px-4">{f.material}</td>
                    <td className="py-3 px-4">₹{f.customerPrice}</td>
                    <td className="py-3 px-4">{f.status}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <Link
                        href={`/admin/fabric-management/edit/${f._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}