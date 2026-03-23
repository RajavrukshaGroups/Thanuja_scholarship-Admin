import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../components/layout/adminLayout";
import api from "../../utils/api";
import ViewDetails from "./viewDetails";
import {
  FiSearch,
  FiX,
  FiCheck,
  FiInfo,
  FiCalendar,
  FiLoader,
  FiUser,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiAward,
  FiDollarSign,
  FiClock,
  FiFileText,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdOutlineSchool, MdOutlineEmojiEvents } from "react-icons/md";
import { FaGraduationCap, FaUniversity, FaUserGraduate } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users when page or search changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setInitialLoading(false);

      const response = await api.get("/admin/users-applied", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchTerm,
        },
      });

      setUsers(response.data.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Calculate stats from current data (or you can add a stats endpoint)
  const stats = {
    total: totalCount,
    active: users.filter((u) => u.isActive).length,
    totalApplications: users.reduce(
      (sum, user) => sum + (user.applications?.length || 0),
      0,
    ),
    totalPayments: users.reduce(
      (sum, user) => sum + (user.payments?.length || 0),
      0,
    ),
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                Users Management
              </h1>
              <p className="text-slate-300 mt-2">
                View and manage all registered users
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <FaUserGraduate className="text-amber-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Total Users</p>
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
                  <p className="text-sm text-slate-300">Active Users</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {stats.active}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-500/20 rounded-lg">
                  <FiFileText className="text-violet-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Applications</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalApplications}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <FiDollarSign className="text-blue-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Payments</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalPayments}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, user ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
            {loading && (
              <FiLoader className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 animate-spin" />
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-slate-400">
          Showing {users.length} of {totalCount} users
          {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
        </div>

        {/* Users Grid */}
        {initialLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 relative overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUserModal(true);
                  }}
                >
                  {/* Premium background pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-pink-500/5 rounded-bl-[100px] -z-10" />

                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        user.isActive
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          user.isActive ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                      ></span>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-slate-400">
                      ID: {user.userId?.slice(-8)}
                    </span>
                  </div>

                  {/* User Icon and Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <FiUser className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {user.fullName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {user.educationLevel || "N/A"}
                        {user.degreeLevel && ` - ${user.degreeLevel}`}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FiMail className="text-amber-400" size={14} />
                      <span className="text-slate-300 text-sm truncate">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiPhone className="text-amber-400" size={14} />
                      <span className="text-slate-300">{user.phone}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-1 text-purple-400">
                      <FiFileText size={12} />
                      <span className="text-xs">
                        {user.applications?.length || 0} Applications
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <FiDollarSign size={12} />
                      <span className="text-xs">
                        {user.payments?.length || 0} Payments
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-slate-400" />
                      Joined: {formatDate(user.createdAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1"
                    >
                      <FiEye size={12} />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition ${
                    currentPage === 1
                      ? "bg-white/5 text-slate-600 cursor-not-allowed"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  <FiChevronLeft />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg transition ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg"
                            : "bg-white/10 text-slate-300 hover:bg-white/20"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="text-slate-600">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition ${
                    currentPage === totalPages
                      ? "bg-white/5 text-slate-600 cursor-not-allowed"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!initialLoading && !loading && users.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md mx-auto border border-white/20">
              <FaUserGraduate className="text-5xl text-amber-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No users found
              </h3>
              <p className="text-slate-300 mb-6">
                {debouncedSearchTerm
                  ? "No users match your search criteria"
                  : "No users have registered yet"}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* User Details Modal */}
      <ViewDetails
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={selectedUser}
      />
    </AdminLayout>
  );
};

export default ViewUsers;
