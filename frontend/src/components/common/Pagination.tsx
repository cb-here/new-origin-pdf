import React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const renderPageButton = (page: number) => (
    <li key={page}>
      <button
        type="button"
        onClick={() => handlePageChange(page)}
        className={`flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg ${
          currentPage === page
            ? "text-white bg-green-500 hover:bg-green-600"
            : "text-gray-700 hover:bg-green-500 hover:text-white dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        {page}
      </button>
    </li>
  );

  const renderEllipsis = (key: string) => (
    <li key={key}>
      <span className="flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 dark:text-gray-400">
        ...
      </span>
    </li>
  );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(renderPageButton(i));
      }
    } else {
      pageNumbers.push(renderPageButton(1));
      if (currentPage > 3) pageNumbers.push(renderEllipsis("start"));

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) end = 5;
      if (currentPage >= totalPages - 2) start = totalPages - 4;

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pageNumbers.push(renderPageButton(i));
        }
      }

      if (currentPage < totalPages - 2) pageNumbers.push(renderEllipsis("end"));
      pageNumbers.push(renderPageButton(totalPages));
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 sm:justify-normal">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:px-3.5 sm:py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeftIcon className="w-5 h-5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Info for Mobile */}
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 sm:hidden">
        Page {currentPage} of {totalPages}
      </span>

      {/* Page Numbers for Desktop */}
      <ul className="hidden items-center gap-0.5 sm:flex">{renderPageNumbers()}</ul>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:px-3.5 sm:py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRightIcon className="w-5 h-5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};

export default Pagination;