import { useEffect, useState } from "react";
import api from "../../utils/api";
import AdminLayout from "../../components/layout/adminLayout";
import {
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiMail,
  FiUser,
  FiAward,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa";
import Pagination from "../../components/common/Pagination";
import ViewDetails from "../viewUsers/viewDetails";

const Applications = () => {
  // Today's Applications State
  const [todayApps, setTodayApps] = useState([]);
  const [todayPage, setTodayPage] = useState(1);
  const [todayTotal, setTodayTotal] = useState(0);
  const [todayTotalPages, setTodayTotalPages] = useState(1);

  // All Applications State
  const [allApps, setAllApps] = useState([]);
  const [allPage, setAllPage] = useState(1);
  const [allTotal, setAllTotal] = useState(0);
  const [allTotalPages, setAllTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingToday, setLoadingToday] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch data when page changes
  useEffect(() => {
    fetchTodayApplications();
  }, [todayPage]);

  useEffect(() => {
    fetchAllApplications();
  }, [allPage]);

  const fetchTodayApplications = async () => {
    try {
      setLoadingToday(true);
      const res = await api.get("/admin/applications-list", {
        params: {
          todayPage,
          todayLimit: 10,
          allPage,
          allLimit: 10,
        },
      });

      setTodayApps(res.data.data.today.data);
      setTodayTotal(res.data.data.today.total);
      setTodayTotalPages(res.data.data.today.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingToday(false);
      setLoading(false);
    }
  };

  const fetchAllApplications = async () => {
    try {
      setLoadingAll(true);
      const res = await api.get("/admin/applications-list", {
        params: {
          todayPage,
          todayLimit: 10,
          allPage,
          allLimit: 10,
        },
      });

      setAllApps(res.data.data.all.data);
      setAllTotal(res.data.data.all.total);
      setAllTotalPages(res.data.data.all.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAll(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      submitted: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
      under_review: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
      approved:
        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      rejected: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
    };

    return (
      statusMap[status?.toLowerCase()] ||
      "bg-slate-500/20 text-slate-300 border border-slate-500/30"
    );
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      submitted: <FiClock className="text-amber-400" size={12} />,
      under_review: <FiClock className="text-blue-400" size={12} />,
      approved: <FiCheckCircle className="text-emerald-400" size={12} />,
      rejected: <FiX className="text-rose-400" size={12} />,
    };

    return (
      iconMap[status?.toLowerCase()] || (
        <FiFileText className="text-slate-400" size={12} />
      )
    );
  };

  const ApplicationTable = ({
    data,
    title,
    icon,
    color,
    count,
    currentPage,
    totalPages,
    onPageChange,
    loading,
    total,
  }) => {
    if (loading) {
      return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFileText className="text-slate-500 text-2xl" />
            </div>
            <p className="text-slate-400 text-sm">No applications found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:border-white/30 transition-all">
        {/* Table Header with Gradient */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
            >
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="text-xs text-slate-400 flex items-start">
                {total} application{total !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiUser size={12} />
                    Applicant
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiMail size={12} />
                    Email
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiAward size={12} />
                    Scholarship
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle size={12} />
                    Status
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  View
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FiCalendar size={12} />
                    Date
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                        <FaUserGraduate className="text-amber-400 text-sm" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {app.user?.fullName || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiMail className="text-slate-500 text-xs" />
                      <span className="text-sm text-slate-300">
                        {app.user?.email || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MdOutlineSchool className="text-amber-500 text-sm" />
                      <span className="text-sm text-slate-300 max-w-[200px] truncate">
                        {app.scholarship?.name || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}
                    >
                      {getStatusIcon(app.status)}
                      <span className="capitalize">
                        {app.status || "submitted"}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={async () => {
                        if (!app.user?._id) return;

                        try {
                          const res = await api.get(
                            `/admin/user-details/${app.user._id}`,
                          );
                          setSelectedUser(res.data.data);
                          setShowModal(true);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 hover:scale-110 transition text-amber-400 hover:text-amber-300"
                      title="View Details"
                    >
                      <FiEye size={16} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-slate-500 text-xs" />
                      <span className="text-sm text-slate-300">
                        {formatDate(app.createdAt)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          loading={loading}
        />
      </div>
    );
  };

  // Stats calculation from total counts
  const todayCount = todayTotal;
  const totalCount = allTotal;
  const approvedCount = allApps.filter(
    (app) => app.status === "approved",
  ).length;
  const pendingCount = allApps.filter(
    (app) => app.status === "submitted" || app.status === "under_review",
  ).length;

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FiFileText className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                    Applications Overview
                  </h1>
                  <p className="text-slate-300 mt-1">
                    Track and manage all scholarship applications
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <FiCalendar className="text-amber-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Today's Applications</p>
                  <p className="text-2xl font-bold text-white">{todayCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-500/20 rounded-lg">
                  <FiUsers className="text-violet-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Total Applications</p>
                  <p className="text-2xl font-bold text-white">{totalCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <FiCheckCircle className="text-emerald-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Approved</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {approvedCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <FiClock className="text-amber-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Pending Review</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT - Today's Applications */}
          <div>
            <ApplicationTable
              data={todayApps}
              title="Today's Applications"
              icon={<FiCalendar className="text-emerald-400 text-lg" />}
              color="bg-emerald-500/20"
              count={todayCount}
              total={todayTotal}
              currentPage={todayPage}
              totalPages={todayTotalPages}
              onPageChange={setTodayPage}
              loading={loadingToday}
            />
          </div>

          {/* RIGHT - All Applications */}
          <div>
            <ApplicationTable
              data={allApps}
              title="All Applications"
              icon={<FiUsers className="text-blue-400 text-lg" />}
              color="bg-blue-500/20"
              count={totalCount}
              total={allTotal}
              currentPage={allPage}
              totalPages={allTotalPages}
              onPageChange={setAllPage}
              loading={loadingAll}
            />
          </div>
        </div>
      </div>
      <ViewDetails
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={selectedUser}
      />{" "}
    </AdminLayout>
  );
};

export default Applications;
