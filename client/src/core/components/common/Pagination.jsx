import { getPagination } from "../../utils/paginationUtils";
const Pagination = ({ page, totalPages, onPageChange }) => {
  // if there is only 1 page or no pages, don't render the pagination component
  if (!totalPages || totalPages <= 1) return null;

  // use the getPagination utility to get an array of page numbers and ellipses
  const pagesArray = getPagination(page, totalPages);

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      {/* Previous Button */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-30 transition-all"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pagesArray.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-300 font-black">
            ...
          </span>
        ) : (
          <button
            key={`page-${p}`}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
              page === p
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next Button */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-30 transition-all"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
