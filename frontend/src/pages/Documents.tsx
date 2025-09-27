import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Edit, FileText, RefreshCw } from "lucide-react";
import { fetchUsers, fetchDocumentForEdit } from "@/lib/fetchApis";
import { generatePDF } from "@/lib/api";
import TableFooter from "@/components/common/TableFooter";
import { formatDate } from "@/lib/utils/formatDate";
import { toast } from "sonner";
import Search from "@/components/common/SearchInput";
import CommonTable from "@/components/common/ReusableTable";
import { FiDownload, FiEdit } from "react-icons/fi";

const Documents = () => {
  const headers = [
    {
      label: "Patient Name",
      render: (item) =>
        item?.patientName ? (
          <span>{item.patientName}</span>
        ) : (
          <span className="block text-center w-full">-</span>
        ),
    },
    {
      label: "SOC Date",
      render: (item) =>
        item?.socDate ? (
          <span>{formatDate(item.socDate)}</span>
        ) : (
          <span className="block text-center w-full">-</span>
        ),
    },
    {
      label: "MRN",
      render: (item) =>
        item?.mrn ? (
          <span>{item.mrn}</span>
        ) : (
          <span className="block text-center w-full">-</span>
        ),
    },
    {
      label: "Clinician",
      render: (item) =>
        item?.clinicianPrintName ? (
          <span>{item.clinicianPrintName}</span>
        ) : (
          <span className="block text-center w-full">-</span>
        ),
    },
    {
      label: "Created",
      render: (item) =>
        item?.createdAt ? (
          <span className="text-muted-foreground">
            {formatDate(item.createdAt)}
          </span>
        ) : (
          <span className="block text-center w-full">-</span>
        ),
    },
  ];

  const actions = [
    {
      label: "Edit",
      render: (item) => (
        <span
          className={`cursor-pointer text-blue-500 hover:text-blue-700 transition-colors ${
            editingId === item._id ? "opacity-50" : ""
          }`}
          onClick={() => handleEdit(item)}
          title="Edit"
        >
          {editingId === item._id ? (
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <FiEdit size={20} />
          )}
        </span>
      ),
    },
    {
      label: "Download",
      render: (item) => (
        <span
          className={`cursor-pointer text-blue-500 hover:text-blue-700 transition-colors ${
            downloadingId === item._id || item.status === "Draft"
              ? "opacity-50"
              : ""
          }`}
          onClick={() => item.status !== "Draft" && handleDownload(item)}
          title="Download"
        >
          {downloadingId === item._id ? (
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <FiDownload size={20} />
          )}
        </span>
      ),
    },
  ];

  const navigate = useNavigate();
  const [documentData, setDocumentData] = useState({
    totalRecords: 0,
    Users: [],
  });
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [documentParams, setDocumentParams] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  const initialFetch = useRef(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const getUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetchUsers({
        page: params?.page ?? documentParams.page,
        limit: params?.limit ?? documentParams.limit,
        search: params?.search ?? documentParams.search,
      });
      setDocumentData(res);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialFetch.current) {
      getUsers();
      initialFetch.current = true;
    }
  }, []);

  const totalPages = Math.ceil(
    documentData.totalRecords / documentParams.limit
  );
  const startIndex = (documentParams.page - 1) * documentParams.limit;
  const endIndex = Math.min(
    startIndex + documentParams.limit,
    documentData.totalRecords
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDocumentParams((prev) => ({ ...prev, search: value, page: 1 }));

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      getUsers({ search: value, page: 1 });
    }, 500);
  };

  const handlePageChange = (page: number) => {
    setDocumentParams((prev) => ({ ...prev, page }));
    getUsers({ page });
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = parseInt(e.target.value, 10);
    setDocumentParams((prev) => ({ ...prev, page: 1, limit }));
    getUsers({ page: 1, limit });
  };

  const handleDownload = async (doc) => {
    setDownloadingId(doc._id);

    try {
      toast.loading(`Downloading document for ${doc.patientName}...`, {
        id: `download-${doc._id}`,
      });

      await generatePDF(doc, doc.patientName || "Patient", true);

      toast.success(`Document downloaded successfully!`, {
        id: `download-${doc._id}`,
      });
    } catch (error) {
      console.error(`Failed to download document:`, error);
      toast.error(`Failed to download document. Please try again.`, {
        id: `download-${doc._id}`,
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleEdit = async (doc) => {
    console.log(`Editing document for ${doc.patientName} (ID: ${doc._id})`);
    setEditingId(doc._id);

    try {
      toast.loading(`Loading document for editing...`, {
        id: `edit-${doc._id}`,
      });

      const editData = await fetchDocumentForEdit(doc._id);

      localStorage.setItem("editingFormData", JSON.stringify(editData));
      localStorage.setItem("editingDocumentId", doc._id);

      toast.success(`Document loaded! Redirecting to editor...`, {
        id: `edit-${doc._id}`,
      });

      setTimeout(() => {
        navigate("/esoc", { state: { editMode: true } });
      }, 800);
    } catch (error) {
      console.error("Failed to fetch document for editing:", error);
      toast.error(`Failed to load document for editing. Please try again.`, {
        id: `edit-${doc._id}`,
      });
    } finally {
      setEditingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background rounded-lg">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-3 p-3 flex-col sm:flex-row">
              <div className="flex items-start gap-2">
                <FileText className="w-6 sm:w-7 h-6 sm:h-7 mt-2 text-blue-500" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">
                    SOC Dashboard
                  </h1>
                  <p className="text-sm text-gray-400">
                    View and manage submitted SOC forms
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 mr-2 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getUsers()}
                  disabled={loading}
                  className="flex items-center gap-2 h-11 w-full s:w-full auto"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Search
                  className="w-auto sm:w-[336px]"
                  value={documentParams?.search}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="flex items-center justify-end mb-3 mr-4"></div>

            <div className="overflow-x-auto">
              <CommonTable
                headers={headers}
                data={documentData?.Users || []}
                actions={actions}
                loading={loading}
                withCheckbox={false}
              />
              <TableFooter
                rowsPerPage={documentParams?.limit}
                handleRowsPerPageChange={handleRowsPerPageChange}
                currentPage={documentParams?.page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                totalEntries={documentData?.totalRecords}
                startIndex={startIndex}
                endIndex={endIndex}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;
