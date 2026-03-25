import { useState, useEffect } from "react";
import {
  FiMenu,
  FiLogOut,
  FiBell,
  FiUser,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import { logoutAdmin } from "../../utils/auth";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState(3); // This would come from your state/context

  const [appStats, setAppStats] = useState({
    totalApplications: 0,
    todayApplications: 0,
    totalUsers: 0,
    todayUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/application-stats");
        if (res.data.success) {
          setAppStats(res.data.data);
        }
      } catch (err) {
        console.error("application error stats", err);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logoutAdmin();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-700/50 shadow-lg">
      <div className="flex items-center justify-between px-4 md:px-6 py-2">
        {/* Left Section - Menu Toggle & Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group relative"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="text-xl" />
            {/* Tooltip */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              {sidebarOpen ? "Close sidebar" : "Open sidebar"}
            </span>
          </button>

          {/* Breadcrumb - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-slate-400">Dashboard</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-medium">Overview</span>
          </nav>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group"
            >
              <FiBell className="text-xl" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center shadow-lg">
                  {notifications}
                </span>
              )}
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                Notifications
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-700 bg-slate-800">
                    <h3 className="text-sm font-semibold text-white">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto bg-slate-800">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="p-3 hover:bg-slate-700 transition-colors cursor-pointer border-b border-slate-700 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center text-white text-xs shadow-md">
                            {item}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white">
                              New scholarship application
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              2 minutes ago
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-700 bg-slate-800">
                    <button className="w-full text-center text-xs text-amber-400 hover:text-amber-300 py-1 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 md:gap-3 p-1 md:pr-3 rounded-lg bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 transition-all duration-200 group shadow-md"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-white/80">admin@scholarhub.com</p>
              </div>
              <FiChevronDown className="hidden md:block text-white/80 group-hover:text-white transition-colors text-sm" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-700 bg-slate-800 md:hidden">
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <p className="text-xs text-slate-400">
                      admin@scholarhub.com
                    </p>
                  </div>
                  <div className="p-2 bg-slate-800">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors group">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs shadow-md">
                        <FiUser size={14} />
                      </div>
                      <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors group">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center text-white text-xs shadow-md">
                        <FiSettings size={14} />
                      </div>
                      <span>Settings</span>
                    </button>
                    <div className="h-px bg-slate-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/20 rounded-lg transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white text-xs shadow-md">
                        <FiLogOut size={14} />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Breadcrumb - Shows below header on mobile */}
      <div className="md:hidden px-4 py-2 border-t border-slate-700/50 bg-slate-900/95">
        <nav className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Dashboard</span>
          <span className="text-slate-600">/</span>
          <span className="text-white font-medium">Overview</span>
        </nav>
      </div>

      {/* Quick Stats Bar - Hidden on mobile */}
      <div className="hidden lg:block px-6 py-2 border-t border-slate-700/50 bg-slate-900/95">
        <div className="flex items-center gap-6 text-xs">
          {/* New Applications */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80"
            onClick={() => navigate("/admin/applications?type=today")}
          >
            <span className="text-slate-400">New Applications:</span>
            <span className="text-emerald-400 font-semibold">
              +{appStats.todayApplications}
            </span>
          </div>

          <div className="w-px h-4 bg-slate-700"></div>

          {/* Total Applications */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80"
            onClick={() => navigate("/admin/applications?type=all")}
          >
            <span className="text-slate-400">Total Applications:</span>
            <span className="text-blue-400 font-semibold">
              {appStats.totalApplications}
            </span>
          </div>

          <div className="w-px h-4 bg-slate-700"></div>

          {/* New Users */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">New Users:</span>
            <span className="text-purple-400 font-semibold">
              +{appStats.todayUsers}
            </span>
          </div>

          <div className="w-px h-4 bg-slate-700"></div>

          {/* Total Users */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Total Users:</span>
            <span className="text-pink-400 font-semibold">
              {appStats.totalUsers}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
