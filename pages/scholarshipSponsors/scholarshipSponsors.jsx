import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../components/layout/adminLayout";
import api from "../../utils/api";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPower,
  FiSearch,
  FiX,
  FiCheck,
  FiInfo,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { FaUniversity, FaGraduationCap } from "react-icons/fa";

const ScholarshipSponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/sponsors");
      //   toast.success(response.data.message);
      setSponsors(response.data.data);
    } catch (err) {
      toast.error("Failed to fetch sponsors");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setLoading(true);

      if (editingSponsor) {
        const res = await api.put(`/admin/sponsors/${editingSponsor._id}`, {
          title,
          description,
        });
        toast.success("Sponsor updated successfully");
      } else {
        const res = await api.post("/admin/create-sponsors", {
          title,
          description,
        });
        toast.success("Sponsor created successfully");
      }

      fetchSponsors();
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/admin/sponsors/status/${id}`);
      toast.success(res.data.message);
      fetchSponsors();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sponsor?")) {
      return;
    }

    try {
      const res = await api.delete(`/admin/sponsors/${id}`);
      toast.success(res.data.message);
      fetchSponsors();
    } catch (err) {
      toast.error("Failed to delete sponsor");
    }
  };

  const handleEdit = (sponsor) => {
    setEditingSponsor(sponsor);
    setTitle(sponsor.title);
    setDescription(sponsor.description);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingSponsor(null);
    setTitle("");
    setDescription("");
    setShowModal(false);
  };

  //   const filteredSponsors = sponsors.filter((sponsor) => {
  //     const matchesSearch =
  //       sponsor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       sponsor.description.toLowerCase().includes(searchTerm.toLowerCase());

  //     if (filter === "all") return matchesSearch;
  //     if (filter === "active") return matchesSearch && sponsor.isActive;
  //     if (filter === "inactive") return matchesSearch && !sponsor.isActive;
  //     return matchesSearch;
  //   });

  const filteredSponsors = useMemo(() => {
    return sponsors.filter((sponsor) => {
      const matchesSearch =
        sponsor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (filter === "all") return matchesSearch;
      if (filter === "active") return matchesSearch && sponsor.isActive;
      if (filter === "inactive") return matchesSearch && !sponsor.isActive;
      return matchesSearch;
    });
  }, [sponsors, searchTerm, filter]);

  const stats = {
    total: sponsors.length,
    active: sponsors.filter((s) => s.isActive).length,
    inactive: sponsors.filter((s) => !s.isActive).length,
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                Scholarship Sponsors
              </h1>
              <p className="text-slate-300 mt-2">
                Manage your scholarship providers and organizations
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <FiPlus className="text-lg" />
              <span>Add New Sponsor</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <FaUniversity className="text-amber-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Total Sponsors</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <FiCheck className="text-emerald-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Active</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {stats.active}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-500/20 rounded-lg">
                  <FiX className="text-rose-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Inactive</p>
                  <p className="text-2xl font-bold text-rose-400">
                    {stats.inactive}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-500/20 rounded-lg">
                  <FaGraduationCap className="text-violet-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Scholarships</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search sponsors by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                filter === "all"
                  ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg"
                  : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                filter === "active"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("inactive")}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                filter === "inactive"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg"
                  : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Sponsors Grid */}
        {loading && !sponsors.length ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSponsors.map((sponsor) => (
              <div
                key={sponsor._id}
                className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      sponsor.isActive
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${sponsor.isActive ? "bg-emerald-400" : "bg-rose-400"}`}
                    ></span>
                    {sponsor.isActive ? "Active" : "Inactive"}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleStatus(sponsor._id)}
                      className={`p-2 rounded-lg transition ${
                        sponsor.isActive
                          ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                      }`}
                      title={sponsor.isActive ? "Deactivate" : "Activate"}
                    >
                      <FiPower className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleEdit(sponsor)}
                      className="p-2 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition"
                      title="Edit"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(sponsor._id)}
                      className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition"
                      title="Delete"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Sponsor Content */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {sponsor.title}
                </h3>
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {sponsor.description}
                </p>

                {/* Footer Info - Updated with formatted date */}
                <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-4 border-t border-white/20">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="text-slate-400" />
                    {formatDate(sponsor.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiInfo className="text-slate-400" />
                    ID: {sponsor._id.slice(-6)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSponsors.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md mx-auto border border-white/20">
              <FaUniversity className="text-5xl text-amber-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No sponsors found
              </h3>
              <p className="text-slate-300 mb-6">
                {searchTerm
                  ? "No sponsors match your search criteria"
                  : "Get started by creating your first scholarship sponsor"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Add Your Sponsor
              </button>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-md w-full border border-white/20 shadow-2xl">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
                    {editingSponsor ? "Edit Sponsor" : "Create New Sponsor"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <FiX className="text-slate-400" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-slate-300 mb-2 text-sm">
                    Sponsor Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Government Scholarship"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 text-sm">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Enter sponsor description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition resize-none placeholder-slate-400"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-60 transition-all duration-300 transform hover:scale-105"
                  >
                    {loading
                      ? "Saving..."
                      : editingSponsor
                        ? "Update"
                        : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ScholarshipSponsors;
