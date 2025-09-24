"use client";

import React from "react";
import RowsPerPage from "./RowsPerPage";
import Pagination from "./Pagination";

interface TableFooterProps {
  rowsPerPage: number;
  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  totalEntries: number;
  startIndex: number;
  endIndex: number;
}

const TableFooter: React.FC<TableFooterProps> = ({
  rowsPerPage,
  handleRowsPerPageChange,
  currentPage,
  totalPages,
  handlePageChange,
  totalEntries,
  startIndex,
  endIndex,
}) => {
  return (
    <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
      <RowsPerPage
        rowsPerPage={rowsPerPage}
        handleRowsPerPageChange={handleRowsPerPageChange}
      />
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mt-3">
        <div className="pb-3 xl:pb-0">
          <p className="pb-3 text-sm font-medium text-left md:text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
            Showing {totalEntries === 0 ? 0 : startIndex + 1} to{" "}
            {endIndex || 0} of {totalEntries || 0} entries
          </p>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableFooter;
