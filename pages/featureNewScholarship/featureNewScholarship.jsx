import { useState, useEffect } from "react";
import { FiFilter } from "react-icons/fi";

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
  FiDollarSign,
  FiFileText,
  FiMapPin,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
} from "react-icons/fi";
import { MdOutlineSchool, MdOutlineDateRange } from "react-icons/md";
import { FaGraduationCap, FaAward, FaUniversity } from "react-icons/fa";
import FilterScholarship from "../filterScholarship/filterScholarship";

const FeatureNewScholarship = () => {
  const [scholarships, setScholarships] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);

  const [fields, setFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [showFieldInput, setShowFieldInput] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [showFilterModal, setShowFilterModal] = useState(false);

  const [advancedFilters, setAdvancedFilters] = useState({
    sponsor: [],
    type: [],
    fieldOfStudy: "",
    gender: "",
  });

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    featured: 0,
  });

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    catchyPhrase: "",
    description: "",
    // sponsor: "",
    sponsor: [],
    // type: "",
    type: [],
    fieldOfStudy: "", // ✅ ADD THIS
    educationLevels: [],
    coverageArea: "India",
    eligibilityCriteria: [""],
    genderEligibility: ["Male", "Female", "Other"],
    documentsRequired: [""],
    benefits: [""],
    applicationStartDate: "",
    applicationDeadline: "",
    isFeatured: false,
  });

  // Date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (showFilterModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showFilterModal]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch scholarships when page, search, or filter changes
  useEffect(() => {
    fetchScholarships();
  }, [currentPage, debouncedSearchTerm, filter, advancedFilters]);

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setInitialLoading(false);

      const response = await api.get("/admin/view-all-scholarships", {
        params: {
          page: currentPage,
          search: debouncedSearchTerm,
          status: filter,
          sponsor: advancedFilters.sponsor.join(","),
          type: advancedFilters.type.join(","),
          fieldOfStudy: advancedFilters.fieldOfStudy,
          gender: advancedFilters.gender,
        },
      });
      console.log("response filter", response);

      setScholarships(response.data.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
      setStats(response.data.stats); // ✅ Global stats from backend
    } catch (err) {
      toast.error("Failed to fetch scholarships");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [sponsorsRes, typesRes, fieldsRes] = await Promise.all([
        api.get("/admin/dropdown/sponsors"),
        api.get("/admin/dropdown/types"),
        api.get("/admin/dropdown/fields"), // ✅ NEW
      ]);

      setSponsors(sponsorsRes.data.data);
      setTypes(typesRes.data.data);
      setFields(fieldsRes.data.data); // ✅ NEW
    } catch (err) {
      toast.error("Failed to fetch dropdown data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "fieldOfStudy" && value === "__add_new__") {
      setShowFieldInput(true);
      return;
    }

    setFormData((prev) => {
      let updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // ✅ If type changes and is not PostMetric, clear educationLevels
      if (name === "type") {
        const selected = types.find((t) => t._id === value);

        const isPost = selected?.title?.toLowerCase().includes("post metric");

        if (!isPost) {
          updated.educationLevels = [];
        }
      }
      return updated;
    });
  };

  const handleArrayInputChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const handleCreateField = async () => {
    if (!newFieldName.trim()) {
      toast.error("Please enter field name");
      return;
    }

    try {
      const res = await api.post("/admin/create-field", {
        name: newFieldName,
      });

      toast.success("Field created successfully");

      const createdField = res.data.data;

      // Add to dropdown
      setFields((prev) => [...prev, createdField]);

      // Auto select it
      setFormData((prev) => ({
        ...prev,
        fieldOfStudy: createdField._id,
      }));

      setNewFieldName("");
      setShowFieldInput(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating field");
    }
  };

  const selectedType = types.find((t) => t._id === formData.type);
  const isPostMetric = types
    .filter((t) => formData.type.includes(t._id))
    .some((t) => t.title?.toLowerCase().includes("post metric"));
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.sponsor ||
      // !formData.type ||
      !formData.type ||
      formData.type.length === 0 ||
      !formData.fieldOfStudy || // ✅ NEW
      !formData.applicationStartDate ||
      !formData.applicationDeadline
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (isPostMetric && formData.educationLevels.length === 0) {
      toast.error("Please select at least one education level");
      return;
    }

    if (formData.applicationStartDate > formData.applicationDeadline) {
      toast.error("Deadline must be after start date");
      return;
    }

    try {
      setLoading(true);

      // Filter out empty array items
      const submitData = {
        ...formData,
        eligibilityCriteria: formData.eligibilityCriteria.filter(
          (item) => item.trim() !== "",
        ),
        documentsRequired: formData.documentsRequired.filter(
          (item) => item.trim() !== "",
        ),
        benefits: formData.benefits.filter((item) => item.trim() !== ""),
      };

      if (editingScholarship) {
        const res = await api.put(
          `/admin/scholarship-update/${editingScholarship._id}`,
          submitData,
        );
        toast.success("Scholarship updated successfully");
      } else {
        const res = await api.post(
          "/admin/create-scholarship-details",
          submitData,
        );
        toast.success("Scholarship created successfully");
      }

      // Reset to first page and refresh
      setCurrentPage(1);
      fetchScholarships();
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
      setLoading(true);
      const res = await api.patch(`/admin/scholarship/status/${id}`);
      toast.success(res.data.message);
      fetchScholarships();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/admin/scholarship-delete/${id}`);
      toast.success("Scholarship deleted successfully");

      // If current page has no items after deletion, go to previous page
      if (scholarships.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchScholarships();
      }
    } catch (err) {
      toast.error("Failed to delete scholarship");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      name: scholarship.name || "",
      catchyPhrase: scholarship.catchyPhrase || "",
      description: scholarship.description || "",
      // sponsor: scholarship.sponsor?._id || "",
      sponsor: scholarship.sponsor?.map((s) => s._id) || [],
      // type: scholarship.type?._id || "",
      type: scholarship.type?.map((t) => t._id) || [],
      fieldOfStudy: scholarship.fieldOfStudy?._id || "",
      educationLevels: scholarship.educationLevels || [], // ✅ ADD THIS
      genderEligibility: scholarship.genderEligibility || [
        "Male",
        "Female",
        "Other",
      ],
      coverageArea: scholarship.coverageArea || "India",
      eligibilityCriteria: scholarship.eligibilityCriteria?.length
        ? scholarship.eligibilityCriteria
        : [""],
      documentsRequired: scholarship.documentsRequired?.length
        ? scholarship.documentsRequired
        : [""],
      benefits: scholarship.benefits?.length ? scholarship.benefits : [""],
      applicationStartDate: scholarship.applicationStartDate
        ? new Date(scholarship.applicationStartDate).toISOString().split("T")[0]
        : "",
      applicationDeadline: scholarship.applicationDeadline
        ? new Date(scholarship.applicationDeadline).toISOString().split("T")[0]
        : "",
      isFeatured: scholarship.isFeatured || false,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingScholarship(null);
    setFormData({
      name: "",
      catchyPhrase: "",
      description: "",
      sponsor: "",
      // type: "",
      type: [],
      fieldOfStudy: "",
      educationLevels: [],
      coverageArea: "India",
      eligibilityCriteria: [""],
      genderEligibility: ["Male", "Female", "Other"],
      documentsRequired: [""],
      benefits: [""],
      applicationStartDate: "",
      applicationDeadline: "",
      isFeatured: false,
    });
    setShowModal(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                Scholarships Management
              </h1>
              <p className="text-slate-300 mt-2">
                Create and manage scholarship opportunities
              </p>
            </div>

            {/* Action Buttons - Filter and Add New */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition relative"
              >
                <div className="flex items-center gap-2">
                  <FiFilter />
                  <span>Filters</span>
                  {(() => {
                    const count =
                      (advancedFilters.sponsor?.length || 0) +
                      (advancedFilters.type?.length || 0) +
                      (advancedFilters.fieldOfStudy ? 1 : 0) +
                      (advancedFilters.gender ? 1 : 0);
                    return (
                      count > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          {count}
                        </span>
                      )
                    );
                  })()}
                </div>
              </button>

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
                <span>Add New Scholarship</span>
              </button>
            </div>
          </div>

          {/* Active Filters Display - Below the buttons */}
          {advancedFilters &&
            (advancedFilters.sponsor?.length > 0 ||
              advancedFilters.type?.length > 0 ||
              advancedFilters.fieldOfStudy ||
              advancedFilters.gender) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-400">Active filters:</span>

                {/* Sponsor filters */}
                {advancedFilters.sponsor?.map((id) => {
                  const sponsor = sponsors.find((s) => s._id === id);
                  return (
                    sponsor && (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs border border-amber-500/30"
                      >
                        {sponsor.title}
                        <button
                          onClick={() => {
                            const newFilters = {
                              ...advancedFilters,
                              sponsor: advancedFilters.sponsor.filter(
                                (s) => s !== id,
                              ),
                            };
                            setAdvancedFilters(newFilters);
                            setCurrentPage(1);
                          }}
                          className="ml-1 hover:text-white transition"
                        >
                          <FiX size={12} />
                        </button>
                      </span>
                    )
                  );
                })}

                {/* Type filters */}
                {advancedFilters.type?.map((id) => {
                  const type = types.find((t) => t._id === id);
                  return (
                    type && (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs border border-pink-500/30"
                      >
                        {type.title}
                        <button
                          onClick={() => {
                            const newFilters = {
                              ...advancedFilters,
                              type: advancedFilters.type.filter(
                                (t) => t !== id,
                              ),
                            };
                            setAdvancedFilters(newFilters);
                            setCurrentPage(1);
                          }}
                          className="ml-1 hover:text-white transition"
                        >
                          <FiX size={12} />
                        </button>
                      </span>
                    )
                  );
                })}

                {/* Field of Study filter */}
                {advancedFilters.fieldOfStudy && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs border border-emerald-500/30">
                    {
                      fields.find((f) => f._id === advancedFilters.fieldOfStudy)
                        ?.name
                    }
                    <button
                      onClick={() => {
                        setAdvancedFilters({
                          ...advancedFilters,
                          fieldOfStudy: "",
                        });
                        setCurrentPage(1);
                      }}
                      className="ml-1 hover:text-white transition"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}

                {/* Gender filter */}
                {advancedFilters.gender && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs border border-violet-500/30">
                    {advancedFilters.gender}
                    <button
                      onClick={() => {
                        setAdvancedFilters({
                          ...advancedFilters,
                          gender: "",
                        });
                        setCurrentPage(1);
                      }}
                      className="ml-1 hover:text-white transition"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}

                {/* Clear all button */}
                {(advancedFilters.sponsor?.length > 0 ||
                  advancedFilters.type?.length > 0 ||
                  advancedFilters.fieldOfStudy ||
                  advancedFilters.gender) && (
                  <button
                    onClick={() => {
                      setAdvancedFilters({
                        sponsor: [],
                        type: [],
                        fieldOfStudy: "",
                        gender: "",
                      });
                      setCurrentPage(1);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 transition ml-2"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <FaGraduationCap className="text-amber-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Total Scholarships</p>
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
                  <p className="text-sm text-slate-300">Active (Current)</p>
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
                  <p className="text-sm text-slate-300">Inactive (Current)</p>
                  <p className="text-2xl font-bold text-rose-400">
                    {stats.inactive}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-500/20 rounded-lg">
                  <FiStar className="text-violet-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Featured (Current)</p>
                  <p className="text-2xl font-bold text-violet-400">
                    {stats.featured}
                  </p>
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
              placeholder="Search scholarships by name, sponsor, or type..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
            {loading && (
              <FiLoader className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 animate-spin" />
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCurrentPage(1);
                setFilter("all");
              }}
              disabled={loading}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                filter === "all"
                  ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg"
                  : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              All
            </button>
            <button
              onClick={() => {
                setCurrentPage(1);
                setFilter("active");
              }}
              disabled={loading}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                filter === "active"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Active
            </button>
            <button
              onClick={() => {
                setCurrentPage(1);
                setFilter("inactive");
              }}
              disabled={loading}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                filter === "inactive"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg"
                  : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Inactive
            </button>
            <button
              onClick={() => {
                setCurrentPage(1);
                setFilter("featured");
              }}
              disabled={loading}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                filter === "featured"
                  ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg"
                  : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Featured
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-slate-400">
          Showing {scholarships.length} of {totalCount} scholarships
          {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
        </div>

        {/* Scholarships Grid */}
        {initialLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading scholarships...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship) => (
                <div
                  key={scholarship._id}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                >
                  {/* Status Badges */}
                  <div className="mb-4">
                    {/* Status Badges */}
                    <div className="flex gap-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          scholarship.isActive
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            scholarship.isActive
                              ? "bg-emerald-400"
                              : "bg-rose-400"
                          }`}
                        ></span>
                        {scholarship.isActive ? "Active" : "Inactive"}
                      </span>

                      {scholarship.isFeatured && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          <FiStar className="text-xs" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Action Buttons BELOW */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleStatus(scholarship._id)}
                        disabled={loading}
                        className={`p-2 rounded-lg transition ${
                          scholarship.isActive
                            ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                        }`}
                        title={scholarship.isActive ? "Deactivate" : "Activate"}
                      >
                        <FiPower className="text-sm" />
                      </button>

                      <button
                        onClick={() => handleEdit(scholarship)}
                        className="p-2 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition"
                        title="Edit"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>

                      <button
                        onClick={() => handleDelete(scholarship._id)}
                        className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition"
                        title="Delete"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Scholarship Content */}
                  <div className="mb-3">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {scholarship.name}
                    </h3>
                    {scholarship.catchyPhrase && (
                      <p className="text-amber-400 text-sm italic">
                        "{scholarship.catchyPhrase}"
                      </p>
                    )}
                  </div>

                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                    {scholarship.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      <FaUniversity className="text-slate-400" />
                      <span className="text-slate-300">Sponsor:</span>
                      <span className="text-white font-medium">
                        {/* {scholarship.sponsor?.title || "N/A"} */}
                        {scholarship.sponsor?.map((s) => s.title).join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <MdOutlineSchool className="text-slate-400" />
                      <span className="text-slate-300">Type:</span>
                      <span className="text-white font-medium">
                        {/* {scholarship.type?.title || "N/A"} */}
                        {scholarship.type?.map((t) => t.title).join(", ")}
                      </span>
                    </div>
                    {scholarship.educationLevels?.length > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <MdOutlineSchool className="text-slate-400" />
                        <span className="text-slate-300">Education Level:</span>
                        <span className="text-white font-medium">
                          {scholarship.educationLevels.join(", ")}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <FiMapPin className="text-slate-400" />
                      <span className="text-slate-300">Coverage:</span>
                      <span className="text-white font-medium">
                        {scholarship.coverageArea}
                      </span>
                    </div>
                    {scholarship.fieldOfStudy && (
                      <div className="flex items-center gap-2 text-xs">
                        <FiMapPin className="text-slate-400" />
                        <span className="text-slate-300">Field of Study:</span>
                        <span className="text-white font-medium">
                          {scholarship.fieldOfStudy?.name}
                        </span>
                      </div>
                    )}
                    {scholarship.genderEligibility && (
                      <div className="flex items-center gap-1 text-xs">
                        <FiMapPin className="text-slate-400" />
                        <span className="text-slate-300">Gender Eligible:</span>
                        <span className="text-white font-medium">
                          {scholarship.genderEligibility?.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <FiCalendar /> Starts:
                      </span>
                      <span className="text-white">
                        {formatDate(scholarship.applicationStartDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <MdOutlineDateRange /> Deadline:
                      </span>
                      <span className="text-rose-400 font-medium">
                        {formatDate(scholarship.applicationDeadline)}
                      </span>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-4 border-t border-white/20">
                    <span className="flex items-center gap-1">
                      <FiInfo className="text-slate-400" />
                      ID: {scholarship._id.slice(-6)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-slate-400" />
                      {formatDate(scholarship.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                {/* Common Button Style */}
                {[
                  {
                    label: "«",
                    onClick: () => handlePageChange(1),
                    disabled: currentPage === 1 || loading,
                  },
                  {
                    label: <FiChevronLeft />,
                    onClick: () => handlePageChange(currentPage - 1),
                    disabled: currentPage === 1 || loading,
                  },
                ].map((btn, index) => (
                  <button
                    key={index}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl transition text-lg ${
                      btn.disabled
                        ? "bg-white/5 text-slate-600 cursor-not-allowed"
                        : "bg-white/10 text-slate-300 hover:bg-white/20"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}

                {/* Current Page */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 text-white font-semibold text-lg shadow-lg">
                  {currentPage}
                </div>

                {[
                  {
                    label: <FiChevronRight />,
                    onClick: () => handlePageChange(currentPage + 1),
                    disabled: currentPage === totalPages || loading,
                  },
                  {
                    label: "»",
                    onClick: () => handlePageChange(totalPages),
                    disabled: currentPage === totalPages || loading,
                  },
                ].map((btn, index) => (
                  <button
                    key={index}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                    className={`w-12 h-12 flex items-center justify-center rounded-xl transition text-lg ${
                      btn.disabled
                        ? "bg-white/5 text-slate-600 cursor-not-allowed"
                        : "bg-white/10 text-slate-300 hover:bg-white/20"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!initialLoading && !loading && scholarships.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md mx-auto border border-white/20">
              <FaGraduationCap className="text-5xl text-amber-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No scholarships found
              </h3>
              <p className="text-slate-300 mb-6">
                {debouncedSearchTerm
                  ? "No scholarships match your search criteria"
                  : "Get started by creating your first scholarship"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Feature Scholarship
              </button>
            </div>
          </div>
        )}

        {/* Create/Edit Modal - Keep existing modal code here */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full border border-white/20 shadow-2xl my-8">
              {/* Modal content remains the same as before */}
              <div className="p-6 border-b border-white/20 sticky top-0 bg-slate-800 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
                    {editingScholarship
                      ? "Edit Scholarship"
                      : "Create New Scholarship"}
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
                {/* Form fields remain exactly the same as before */}
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-2 text-sm">
                        Scholarship Name{" "}
                        <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. National Merit Scholarship"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-2 text-sm">
                        Catchy Phrase
                      </label>
                      <input
                        type="text"
                        name="catchyPhrase"
                        value={formData.catchyPhrase}
                        onChange={handleInputChange}
                        placeholder="e.g. Empowering Future Leaders"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 text-sm">
                      Description <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Enter detailed scholarship description..."
                      className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition resize-none placeholder-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-2 text-sm">
                        Sponsor <span className="text-rose-400">*</span>
                      </label>
                      {/* <select
                        name="sponsor"
                        value={formData.sponsor}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                      >
                        <option value="" className="bg-slate-800">
                          Select a sponsor
                        </option>
                        {sponsors.map((sponsor) => (
                          <option
                            key={sponsor._id}
                            value={sponsor._id}
                            className="bg-slate-800"
                          >
                            {sponsor.title}
                          </option>
                        ))}
                      </select> */}
                      <div className="space-y-2">
                        {sponsors.map((sponsorItem) => (
                          <label
                            key={sponsorItem._id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              value={sponsorItem._id}
                              checked={formData.sponsor.includes(
                                sponsorItem._id,
                              )}
                              onChange={(e) => {
                                const { checked, value } = e.target;

                                setFormData((prev) => ({
                                  ...prev,
                                  sponsor: checked
                                    ? [...prev.sponsor, value]
                                    : prev.sponsor.filter((id) => id !== value),
                                }));
                              }}
                            />
                            <span className="text-white">
                              {sponsorItem.title}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-2 text-sm">
                        Scholarship Type{" "}
                        <span className="text-rose-400">*</span>
                      </label>
                      {/* <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                      >
                        <option value="" className="bg-slate-800">
                          Select a type
                        </option>
                        {types.map((type) => (
                          <option
                            key={type._id}
                            value={type._id}
                            className="bg-slate-800"
                          >
                            {type.title}
                          </option>
                        ))}
                      </select> */}
                      <div className="space-y-2">
                        {types.map((typeItem) => (
                          <label
                            key={typeItem._id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              value={typeItem._id}
                              checked={formData.type.includes(typeItem._id)}
                              onChange={(e) => {
                                const { checked, value } = e.target;

                                setFormData((prev) => ({
                                  ...prev,
                                  type: checked
                                    ? [...prev.type, value]
                                    : prev.type.filter((id) => id !== value),
                                }));
                              }}
                            />
                            <span className="text-white">{typeItem.title}</span>
                          </label>
                        ))}
                      </div>
                      {isPostMetric && (
                        <div className="mt-4 space-y-3">
                          <label className="block text-slate-300 text-sm">
                            Education Level{" "}
                            <span className="text-rose-400">*</span>
                          </label>

                          <div className="flex gap-6">
                            {["Undergraduate", "Postgraduate", "PhD"].map(
                              (level) => (
                                <label
                                  key={level}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="checkbox"
                                    value={level}
                                    checked={formData.educationLevels?.includes(
                                      level,
                                    )}
                                    onChange={(e) => {
                                      const { checked, value } = e.target;

                                      setFormData((prev) => ({
                                        ...prev,
                                        educationLevels: checked
                                          ? [
                                              ...(prev.educationLevels || []),
                                              value,
                                            ]
                                          : prev.educationLevels.filter(
                                              (item) => item !== value,
                                            ),
                                      }));
                                    }}
                                    className="text-amber-500 focus:ring-amber-500"
                                  />
                                  <span className="text-white">{level}</span>
                                </label>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 space-y-3">
                      <label className="block text-slate-300 text-sm">
                        Gender Eligibility
                      </label>

                      <div className="flex gap-6">
                        {["Male", "Female", "Other"].map((gender) => (
                          <label
                            key={gender}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              value={gender}
                              checked={formData.genderEligibility?.includes(
                                gender,
                              )}
                              onChange={(e) => {
                                const { checked, value } = e.target;

                                setFormData((prev) => ({
                                  ...prev,
                                  genderEligibility: checked
                                    ? [...(prev.genderEligibility || []), value]
                                    : prev.genderEligibility.filter(
                                        (item) => item !== value,
                                      ),
                                }));
                              }}
                            />
                            <span className="text-white">{gender}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-2 text-sm">
                        Field Of Study <span className="text-rose-400">*</span>
                      </label>

                      <select
                        name="fieldOfStudy"
                        value={formData.fieldOfStudy}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                      >
                        <option value="" className="bg-slate-800">
                          Select field of study
                        </option>

                        {fields.map((field) => (
                          <option
                            key={field._id}
                            value={field._id}
                            className="bg-slate-800"
                          >
                            {field.name}
                          </option>
                        ))}

                        <option value="__add_new__" className="bg-slate-800">
                          + Add New Field
                        </option>
                      </select>

                      {/* ✅ MOVE INPUT INSIDE THIS DIV */}
                      {showFieldInput && (
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            value={newFieldName}
                            onChange={(e) => setNewFieldName(e.target.value)}
                            placeholder="Enter new field name"
                            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                          />

                          <button
                            type="button"
                            onClick={handleCreateField}
                            className="px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
                          >
                            Create
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2 text-sm">
                      Coverage Area <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="coverageArea"
                          value="India"
                          checked={formData.coverageArea === "India"}
                          onChange={handleInputChange}
                          className="text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-white">India</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="coverageArea"
                          value="Abroad"
                          checked={formData.coverageArea === "Abroad"}
                          onChange={handleInputChange}
                          className="text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-white">Abroad</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">
                    Application Dates
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 mb-2 text-sm">
                        Start Date <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="date"
                        name="applicationStartDate"
                        value={formData.applicationStartDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-2 text-sm">
                        Deadline <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="date"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">
                    Eligibility Criteria
                  </h3>

                  {formData.eligibilityCriteria.map((criteria, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={criteria}
                        onChange={(e) =>
                          handleArrayInputChange(
                            index,
                            "eligibilityCriteria",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Minimum 60% in 12th grade"
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => addArrayField("eligibilityCriteria")}
                        className="px-3 py-3 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition"
                        title="Add more"
                      >
                        <FiPlus />
                      </button>
                      {formData.eligibilityCriteria.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayField("eligibilityCriteria", index)
                          }
                          className="px-3 py-3 bg-rose-500/20 text-rose-300 rounded-xl hover:bg-rose-500/30 transition"
                          title="Remove"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Documents Required */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">
                    Documents Required
                  </h3>

                  {formData.documentsRequired.map((document, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={document}
                        onChange={(e) =>
                          handleArrayInputChange(
                            index,
                            "documentsRequired",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Mark sheets, ID proof"
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => addArrayField("documentsRequired")}
                        className="px-3 py-3 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition"
                        title="Add more"
                      >
                        <FiPlus />
                      </button>
                      {formData.documentsRequired.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayField("documentsRequired", index)
                          }
                          className="px-3 py-3 bg-rose-500/20 text-rose-300 rounded-xl hover:bg-rose-500/30 transition"
                          title="Remove"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">
                    Benefits
                  </h3>

                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) =>
                          handleArrayInputChange(
                            index,
                            "benefits",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Full tuition fee coverage"
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => addArrayField("benefits")}
                        className="px-3 py-3 bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition"
                        title="Add more"
                      >
                        <FiPlus />
                      </button>
                      {formData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField("benefits", index)}
                          className="px-3 py-3 bg-rose-500/20 text-rose-300 rounded-xl hover:bg-rose-500/30 transition"
                          title="Remove"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Featured Option */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-amber-500 focus:ring-amber-500 rounded"
                    />
                    <label htmlFor="isFeatured" className="text-white">
                      Feature this scholarship (will appear in featured section)
                    </label>
                  </div>
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
                    {loading
                      ? "Saving..."
                      : editingScholarship
                        ? "Update"
                        : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {showFilterModal && (
        <FilterScholarship
          sponsors={sponsors}
          types={types}
          fields={fields}
          initialFilters={advancedFilters}
          onApply={(filters) => {
            setAdvancedFilters(filters);
            setCurrentPage(1);
            // Don't close modal automatically
          }}
          onClose={() => setShowFilterModal(false)}
          isOpen={showFilterModal}
        />
      )}
    </AdminLayout>
  );
};

export default FeatureNewScholarship;
