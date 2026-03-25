import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-white/5">
      {/* Page Info */}
      <div className="text-xs text-slate-400">
        Page <span className="text-white font-medium">{currentPage}</span> of{" "}
        <span className="text-white font-medium">{totalPages}</span>
      </div>

      {/* Arrows */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={`p-2 rounded-lg transition ${
            currentPage === 1 || loading
              ? "bg-white/5 text-slate-600 cursor-not-allowed"
              : "bg-white/10 text-slate-300 hover:bg-white/20"
          }`}
        >
          <FiChevronLeft size={16} />
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={`p-2 rounded-lg transition ${
            currentPage === totalPages || loading
              ? "bg-white/5 text-slate-600 cursor-not-allowed"
              : "bg-white/10 text-slate-300 hover:bg-white/20"
          }`}
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
