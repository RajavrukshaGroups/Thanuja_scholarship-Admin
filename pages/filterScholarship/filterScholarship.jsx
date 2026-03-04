import { useState, useEffect } from "react";
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaUniversity, FaVenusMars } from "react-icons/fa";
import { MdOutlineSchool, MdOutlineBook } from "react-icons/md";

const FilterScholarship = ({
  sponsors,
  types,
  fields,
  initialFilters,
  onApply,
  onClose,
  isOpen,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [expandedSections, setExpandedSections] = useState({
    sponsors: true,
    types: true,
    fields: true,
    gender: true,
  });

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleArrayValue = (field, value) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter((v) => v !== value)
          : [...prev[field], value],
      };
      // Auto-apply filters when checkbox is clicked
      onApply(newFilters);
      return newFilters;
    });
  };

  const handleFieldChange = (value) => {
    const newFilters = {
      ...filters,
      fieldOfStudy: value,
    };
    setFilters(newFilters);
    onApply(newFilters);
  };

  const handleGenderChange = (value) => {
    const newFilters = {
      ...filters,
      gender: value,
    };
    setFilters(newFilters);
    onApply(newFilters);
  };

//   const clearFilter = (type, value) => {
//     if (type === "sponsor" || type === "type") {
//       const newFilters = {
//         ...filters,
//         [type]: filters[type].filter((v) => v !== value),
//       };
//       setFilters(newFilters);
//       onApply(newFilters);
//     } else {
//       const newFilters = {
//         ...filters,
//         [type]: "",
//       };
//       setFilters(newFilters);
//       onApply(newFilters);
//     }
//   };

  const clearAllFilters = () => {
    const newFilters = {
      sponsor: [],
      type: [],
      fieldOfStudy: "",
      gender: "",
    };
    setFilters(newFilters);
    onApply(newFilters);
  };

  const getSponsorName = (id) => {
    return sponsors.find((s) => s._id === id)?.title || id;
  };

  const getTypeName = (id) => {
    return types.find((t) => t._id === id)?.title || id;
  };

  const getFieldName = (id) => {
    return fields.find((f) => f._id === id)?.name || id;
  };

  // Count active filters
  const activeFilterCount =
    (filters.sponsor?.length || 0) +
    (filters.type?.length || 0) +
    (filters.fieldOfStudy ? 1 : 0) +
    (filters.gender ? 1 : 0);

  return (
    <>
      {/* Filter Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-slate-800 to-slate-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-amber-500/10 to-pink-500/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-pink-500 rounded-xl">
                <FiFilter className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Filters</h2>
                <p className="text-sm text-slate-400">Refine scholarships</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <FiX className="text-slate-400 text-xl" />
            </button>
          </div>

          {/* Active filter count */}
          {activeFilterCount > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
                active
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-amber-400 hover:text-amber-300 transition"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-4 overflow-y-auto h-[calc(100vh-180px)]">
          {/* Sponsor Filter */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <button
              onClick={() => toggleSection("sponsors")}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <FaUniversity className="text-amber-400" />
                <h3 className="text-white font-medium">Sponsors</h3>
                {filters.sponsor?.length > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-xs">
                    {filters.sponsor.length}
                  </span>
                )}
              </div>
              {expandedSections.sponsors ? (
                <FiChevronUp className="text-slate-400" />
              ) : (
                <FiChevronDown className="text-slate-400" />
              )}
            </button>

            {expandedSections.sponsors && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {sponsors.map((s) => (
                  <label
                    key={s._id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.sponsor.includes(s._id)}
                      onChange={() => toggleArrayValue("sponsor", s._id)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                    />
                    <span className="text-slate-300 text-sm flex-1 group-hover:text-white transition">
                      {s.title}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <button
              onClick={() => toggleSection("types")}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <MdOutlineSchool className="text-pink-400" />
                <h3 className="text-white font-medium">Scholarship Types</h3>
                {filters.type?.length > 0 && (
                  <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded-full text-xs">
                    {filters.type.length}
                  </span>
                )}
              </div>
              {expandedSections.types ? (
                <FiChevronUp className="text-slate-400" />
              ) : (
                <FiChevronDown className="text-slate-400" />
              )}
            </button>

            {expandedSections.types && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {types.map((t) => (
                  <label
                    key={t._id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.type.includes(t._id)}
                      onChange={() => toggleArrayValue("type", t._id)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-pink-500 focus:ring-pink-500 focus:ring-offset-0"
                    />
                    <span className="text-slate-300 text-sm flex-1 group-hover:text-white transition">
                      {t.title}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Field of Study Filter */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <button
              onClick={() => toggleSection("fields")}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <MdOutlineBook className="text-emerald-400" />
                <h3 className="text-white font-medium">Field of Study</h3>
                {filters.fieldOfStudy && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                    1
                  </span>
                )}
              </div>
              {expandedSections.fields ? (
                <FiChevronUp className="text-slate-400" />
              ) : (
                <FiChevronDown className="text-slate-400" />
              )}
            </button>

            {expandedSections.fields && (
              <select
                value={filters.fieldOfStudy}
                onChange={(e) => handleFieldChange(e.target.value)}
                className="w-full mt-3 p-3 bg-white/10 text-white rounded-xl border border-white/20 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 1rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em",
                }}
              >
                <option value="" className="bg-slate-800">
                  All Fields
                </option>
                {fields.map((f) => (
                  <option key={f._id} value={f._id} className="bg-slate-800">
                    {f.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Gender Filter */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <button
              onClick={() => toggleSection("gender")}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <FaVenusMars className="text-violet-400" />
                <h3 className="text-white font-medium">Gender</h3>
                {filters.gender && (
                  <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full text-xs">
                    1
                  </span>
                )}
              </div>
              {expandedSections.gender ? (
                <FiChevronUp className="text-slate-400" />
              ) : (
                <FiChevronDown className="text-slate-400" />
              )}
            </button>

            {expandedSections.gender && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {["Male", "Female", "Other"].map((gender) => (
                  <button
                    key={gender}
                    onClick={() =>
                      handleGenderChange(
                        filters.gender === gender ? "" : gender,
                      )
                    }
                    className={`p-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      filters.gender === gender
                        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg"
                        : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Apply button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-slate-800/50 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 font-medium"
          >
            View Results
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={onClose}
        />
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
};

export default FilterScholarship;
