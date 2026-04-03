import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import AdminLayout from "../../components/layout/adminLayout";
import api from "../../utils/api";
import { FiUsers, FiDollarSign, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate(); // ✅ INIT

  const [stats, setStats] = useState({
    users: 0,
    payments: 0,
    paymentsCount: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard-stats");
      setStats(res.data.data);
    } catch (err) {
      toast.error("Failed to load dashboard stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-slate-300 mt-2">
            Overview of users and revenue insights
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Users */}
          <div
            onClick={() => navigate("/admin/view-users")}
            className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <FiUsers className="text-amber-400 text-2xl" />
              <span className="text-xs text-slate-400">Users</span>
            </div>

            <h2 className="text-3xl font-bold text-white">{stats.users}</h2>

            <p className="text-slate-400 text-sm mt-1">
              Total registered users
            </p>
          </div>

          {/* Revenue */}
          <div
            onClick={() => navigate("/admin/view-payments")}
            className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <FiDollarSign className="text-amber-400 text-2xl" />
              <span className="text-xs text-slate-400">Revenue</span>
            </div>

            <h2 className="text-3xl font-bold text-white">
              ₹ {stats.payments}
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Total successful payments
            </p>
          </div>

          {/* Successful Payments */}
          <div
            onClick={() => navigate("/admin/view-payments")}
            className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <FiCheckCircle className="text-emerald-400 text-2xl" />
              <span className="text-xs text-slate-400">Transactions</span>
            </div>

            <h2 className="text-3xl font-bold text-white">
              {stats.paymentsCount}
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Successful transactions
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
