import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiSettings,
  FiGrid,
  FiAward,
  FiUploadCloud,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdOutlineSchool, MdOutlineEmojiEvents } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import { FaUniversity } from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const linkClasses = ({ isActive }) =>
    `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
     transition-all duration-300 ease-in-out
     ${
       isActive
         ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg shadow-amber-500/25"
         : "text-slate-300 hover:bg-white/10 hover:text-white hover:translate-x-1"
     }`;

  const navItems = [
    {
      to: "/admin/dashboard",
      icon: FiHome,
      label: "Dashboard",
      badge: null,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      to: "/admin/scholarship-sponsors",
      icon: FaUniversity,
      label: "Scholarship Sponsors",
      badge: "12",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      to: "/admin/scholarship-types",
      icon: MdOutlineSchool,
      label: "Scholarship Type",
      badge: "8",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      to: "/admin/feature-scholarship",
      icon: MdOutlineSchool,
      label: "Feature Scholarship",
      badge: "8",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      to: "/admin/users",
      icon: GiGraduateCap,
      label: "Scholars",
      badge: "156",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      to: "/admin/view-payments",
      icon: FiCreditCard,
      label: "Payments",
      badge: "₹24.5k",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      to: "/admin/post-notification",
      icon: FiUploadCloud,
      label: "Notifications",
      badge: "3",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      to: "/admin/settings",
      icon: FiSettings,
      label: "Settings",
      badge: null,
      gradient: "from-gray-500 to-slate-500",
    },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-purple-900/90 to-slate-900
        backdrop-blur-xl border-r border-white/10
        transition-all duration-500 ease-in-out z-40
        ${isOpen ? "w-72" : "w-24"}`}
      >
        {/* Toggle Button */}
        {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform z-50"
        >
          {isOpen ? <FiChevronLeft size={14} /> : <FiChevronRight size={14} />}
        </button> */}

        {/* Logo Section with Animation */}
        <div className="h-24 flex items-center justify-center border-b border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-pink-500/10"></div>
          <div
            className={`flex items-center gap-3 transition-all duration-500 ${isOpen ? "scale-100" : "scale-110"}`}
          >
            <div className="bg-gradient-to-r from-amber-500 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-amber-500/25">
              <MdOutlineEmojiEvents className="text-white text-2xl" />
            </div>
            <span
              className={`font-bold text-xl transition-all duration-500 bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap
              ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"}`}
            >
              EduFin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 space-y-1.5">
          <p
            className={`text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3 transition-all duration-300
            ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}
          >
            Main Menu
          </p>

          {navItems.map(({ to, icon: Icon, label, badge, gradient }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClasses}
              onMouseEnter={() => setHoveredItem(label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Icon with animated background */}
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${gradient} blur-md`}
                ></div>
                <Icon
                  className={`text-xl shrink-0 relative transition-all duration-300
                    group-hover:scale-110 group-hover:rotate-3
                    ${isOpen ? "ml-0" : "mx-auto"}
                  `}
                />
              </div>

              {/* Label and Badge (expanded mode) */}
              <span
                className={`flex-1 whitespace-nowrap transition-all duration-300 flex items-center justify-between
                  ${
                    isOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4 w-0 overflow-hidden"
                  }
                `}
              >
                <span>{label}</span>
                {badge && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${gradient} text-white shadow-lg`}
                  >
                    {badge}
                  </span>
                )}
              </span>

              {/* Tooltip with gradient (collapsed mode only) */}
              {!isOpen && (
                <span
                  className={`pointer-events-none absolute left-full ml-4
                  rounded-xl px-4 py-2.5 text-sm text-white
                  opacity-0 scale-95 shadow-xl border border-white/10
                  transition-all duration-200 whitespace-nowrap z-50
                  group-hover:opacity-100 group-hover:scale-100
                  bg-gradient-to-r ${gradient}`}
                >
                  {label}
                  {badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-white/20 text-white">
                      {badge}
                    </span>
                  )}
                </span>
              )}

              {/* Active indicator line */}
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-amber-500 to-pink-500 rounded-r-full opacity-0 group-[:active>]:opacity-100 transition-opacity"></span>
            </NavLink>
          ))}
        </nav>
        {/* Decorative gradient line */}
        <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-transparent via-amber-500/50 to-transparent"></div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
