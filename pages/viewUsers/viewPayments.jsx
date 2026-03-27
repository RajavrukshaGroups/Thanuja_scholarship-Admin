import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../components/layout/adminLayout";
import api from "../../utils/api";

import {
  FiSearch,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const ViewPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // const limit = 6;
  const limit = 10;

  // 🔥 Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset page
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchPayments();
  }, [page, debouncedSearch]);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/payments", {
        params: {
          page,
          limit,
          search: debouncedSearch,
        },
      });

      setPayments(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to fetch payments");
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const getStatusUI = (status) => {
    if (status === "success")
      return {
        color: "text-emerald-400",
        bg: "bg-emerald-500/20",
        icon: <FiCheckCircle />,
      };
    if (status === "failed")
      return {
        color: "text-rose-400",
        bg: "bg-rose-500/20",
        icon: <FiXCircle />,
      };
    return {
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
      icon: <FiClock />,
    };
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
            Payment Transactions
          </h1>
          <p className="text-slate-300 mt-2">
            View all payment records and transactions
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Loader */}
        {initialLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading payments...</p>
          </div>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {payments.map((payment) => {
                const statusUI = getStatusUI(payment.status);

                return (
                  <div
                    key={payment._id}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 flex flex-col justify-between min-h-[260px]"
                  >
                    {/* Top */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${statusUI.bg} ${statusUI.color}`}
                        >
                          {statusUI.icon}
                          {payment.status}
                        </span>

                        <span className="text-xs text-slate-400 capitalize">
                          {payment.paymentType}
                        </span>
                      </div>

                      {/* User */}
                      <p className="text-white font-semibold flex items-center gap-2">
                        <FiUser /> {payment.userSnapshot?.fullName}
                      </p>

                      <p className="text-slate-400 text-sm mb-3 truncate flex items-start">
                        {payment.userSnapshot?.email}
                      </p>

                      {/* Amount */}
                      <p className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <FiDollarSign className="text-amber-400" />
                        {formatCurrency(payment.amount)}
                      </p>

                      {/* Plan */}
                      <p className="text-sm text-slate-300 flex items-start">
                        Plan:
                        <span className="text-white font-medium">
                          {payment.plan?.planTitle || "N/A"}
                        </span>
                      </p>

                      {/* Order */}
                      <p className="text-xs text-slate-400 mt-1 break-all flex items-start">
                        {payment.razorpayOrderId}
                      </p>
                    </div>

                    {/* Bottom (Always aligned) */}
                    <div className="text-xs text-slate-400 mt-4 flex items-center gap-1 border-t border-white/10 pt-3">
                      <FiCalendar />
                      {formatDate(payment.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🔥 Pagination */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-40"
              >
                <FiChevronLeft />
              </button>

              <span className="text-white">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-40"
              >
                <FiChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ViewPayments;
