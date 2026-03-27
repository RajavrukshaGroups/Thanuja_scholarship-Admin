import { useState, useEffect } from "react";
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
  FiDollarSign,
  FiClock,
  FiAward,
  FiLoader,
} from "react-icons/fi";
import { MdOutlineWorkspacePremium, MdOutlineCategory } from "react-icons/md";
import { FaCrown, FaGem, FaStar } from "react-icons/fa";
import { GiDuration } from "react-icons/gi";

const MembershipPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, inactive

  // Form states
  const [formData, setFormData] = useState({
    planTitle: "",
    amount: "",
    planDuration: "",
    maxScholarships: "",
    benefits: [""],
  });

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setInitialLoading(true);
      const response = await api.get("/admin/membership-plans");
      setPlans(response.data.data);
    } catch (err) {
      toast.error("Failed to fetch membership plans");
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBenefitChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.map((item, i) => (i === index ? value : item)),
    }));
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }));
  };

  const removeBenefit = (index) => {
    if (formData.benefits.length > 1) {
      setFormData((prev) => ({
        ...prev,
        benefits: prev.benefits.filter((_, i) => i !== index),
      }));
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.planTitle ||
      !formData.amount ||
      !formData.planDuration ||
      !formData.maxScholarships
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Filter out empty benefits
    const submitData = {
      ...formData,
      amount: Number(formData.amount),
      planDuration: Number(formData.planDuration),
      maxScholarships: Number(formData.maxScholarships),
      benefits: formData.benefits.filter((b) => b.trim() !== ""),
    };

    try {
      setLoading(true);

      if (editingPlan) {
        await api.put(`/admin/membership-plan/${editingPlan._id}`, submitData);
        toast.success("Membership plan updated successfully");
      } else {
        await api.post("/admin/membership-plan", submitData);
        toast.success("Membership plan created successfully");
      }

      fetchPlans();
      resetForm();
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      const res = await api.patch(`/admin/membership-plan/status/${id}`);
      toast.success(res.data.message);
      fetchPlans();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this membership plan?")
    ) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/admin/membership-plan/${id}`);
      toast.success("Membership plan deleted successfully");
      fetchPlans();
    } catch (err) {
      toast.error("Failed to delete membership plan");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      planTitle: plan.planTitle,
      amount: plan.amount,
      planDuration: plan.planDuration,
      maxScholarships: plan.maxScholarships,
      benefits: plan.benefits?.length ? plan.benefits : [""],
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingPlan(null);
    setFormData({
      planTitle: "",
      amount: "",
      planDuration: "",
      maxScholarships: "",
      benefits: [""],
    });
    setShowModal(false);
  };

  // Filter plans based on search and status
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = plan.planTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && plan.isActive;
    if (filter === "inactive") return matchesSearch && !plan.isActive;
    return matchesSearch;
  });

  const stats = {
    total: plans.length,
    active: plans.filter((p) => p.isActive).length,
    inactive: plans.filter((p) => !p.isActive).length,
  };

  // Get icon based on plan index or title
  const getPlanIcon = (index, title) => {
    const icons = [
      <FaCrown className="text-amber-400" />,
      <FaGem className="text-blue-400" />,
      <FaStar className="text-purple-400" />,
      <FaCrown className="text-emerald-400" />,
    ];
    return icons[index % icons.length];
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format duration
  const formatDuration = (days) => {
    if (days === 30) return "Monthly";
    if (days === 90) return "Quarterly";
    if (days === 180) return "Half Yearly";
    if (days === 365) return "Yearly";
    return `${days} Days`;
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                Membership Plans
              </h1>
              <p className="text-slate-300 mt-2">
                Manage subscription plans and pricing
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiPlus className="text-lg" />
              )}
              <span>Add New Plan</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <MdOutlineWorkspacePremium className="text-amber-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Total Plans</p>
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
                  <FiDollarSign className="text-violet-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Revenue</p>
                  <p className="text-2xl font-bold text-white">₹24.5k</p>
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
              placeholder="Search plans by title..."
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

        {/* Results count */}
        <div className="mb-4 text-sm text-slate-400">
          Showing {filteredPlans.length} of {stats.total} plans
          {searchTerm && ` for "${searchTerm}"`}
        </div>

        {/* Plans Grid */}
        {initialLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading membership plans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan, index) => (
              <div
                key={plan._id}
                className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 relative overflow-hidden"
              >
                {/* Premium background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-pink-500/5 rounded-bl-[100px] -z-10" />

                {/* Status Badge and Actions */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      plan.isActive
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${plan.isActive ? "bg-emerald-400" : "bg-rose-400"}`}
                    ></span>
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        handleToggleStatus(plan._id, plan.isActive)
                      }
                      disabled={loading}
                      className={`p-2 rounded-lg transition ${
                        plan.isActive
                          ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                      } disabled:opacity-50`}
                      title={plan.isActive ? "Deactivate" : "Activate"}
                    >
                      <FiPower className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleEdit(plan)}
                      disabled={loading}
                      className="p-2 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition disabled:opacity-50"
                      title="Edit"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      disabled={loading}
                      className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition disabled:opacity-50"
                      title="Delete"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Plan Icon and Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    {getPlanIcon(index, plan.planTitle)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {plan.planTitle}
                    </h3>
                    <p className="text-xs text-slate-400">
                      ID: {plan._id.slice(-6)}
                    </p>
                  </div>
                </div>

                {/* Price and Duration */}
                <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-white/10">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {formatCurrency(plan.amount)}
                    </p>
                    <p className="text-xs text-slate-400">one-time payment</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400">
                      <GiDuration className="text-lg" />
                      <span className="font-medium">
                        {formatDuration(plan.planDuration)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">plan duration</p>
                  </div>
                </div>

                {/* Benefits */}
                {plan.benefits && plan.benefits.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Benefits
                    </p>
                    <ul className="space-y-2">
                      {plan.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span className="text-slate-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm mt-3">
                  <span className="flex items-center gap-1 text-purple-400">
                    <FiAward />
                    {plan.maxScholarships} Scholarships
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-4 border-t border-white/20">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="text-slate-400" />
                    Created: {formatDate(plan.createdAt)}{" "}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiInfo className="text-slate-400" />
                    {plan.benefits?.length || 0} benefits
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!initialLoading && filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md mx-auto border border-white/20">
              <MdOutlineWorkspacePremium className="text-5xl text-amber-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No membership plans found
              </h3>
              <p className="text-slate-300 mb-6">
                {searchTerm
                  ? "No plans match your search criteria"
                  : "Get started by creating your first membership plan"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Create Your First Plan
              </button>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full border border-white/20 shadow-2xl my-8">
              <div className="p-6 border-b border-white/20 sticky top-0 bg-slate-800 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
                    {editingPlan
                      ? "Edit Membership Plan"
                      : "Create New Membership Plan"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <FiX className="text-slate-400" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
              >
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">
                    Plan Details
                  </h3>

                  <div>
                    <label className="block text-slate-300 mb-2 text-sm">
                      Plan Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="planTitle"
                      value={formData.planTitle}
                      onChange={handleInputChange}
                      placeholder="e.g. Premium Membership"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition placeholder-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-2 text-sm">
                        Amount (INR) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="e.g. 999"
                        min="0"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-2 text-sm">
                        Duration (days) <span className="text-rose-400">*</span>
                      </label>
                      <select
                        name="planDuration"
                        value={formData.planDuration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                      >
                        <option value="" className="bg-slate-800">
                          Select duration
                        </option>
                        <option value="30" className="bg-slate-800">
                          Monthly (30 days)
                        </option>
                        <option value="90" className="bg-slate-800">
                          Quarterly (90 days)
                        </option>
                        <option value="180" className="bg-slate-800">
                          Half Yearly (180 days)
                        </option>
                        <option value="365" className="bg-slate-800">
                          Yearly (365 days)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-2 text-sm">
                        Maximum Scholarships{" "}
                        <span className="text-rose-400">*</span>
                      </label>

                      <input
                        type="number"
                        name="maxScholarships"
                        value={formData.maxScholarships}
                        onChange={handleInputChange}
                        placeholder="e.g. 10"
                        min="1"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">
                    Plan Benefits
                  </h3>

                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) =>
                          handleBenefitChange(index, e.target.value)
                        }
                        placeholder="e.g. Access to all scholarships"
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={addBenefit}
                        className="px-3 py-3 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition"
                        title="Add more"
                      >
                        <FiPlus />
                      </button>
                      {formData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="px-3 py-3 bg-rose-500/20 text-rose-300 rounded-xl hover:bg-rose-500/30 transition"
                          title="Remove"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 sticky bottom-0 bg-slate-800 pb-2">
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
                    {loading ? "Saving..." : editingPlan ? "Update" : "Create"}
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

export default MembershipPlans;
