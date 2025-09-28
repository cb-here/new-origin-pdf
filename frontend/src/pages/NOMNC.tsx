import React, { useEffect, useRef, useState } from "react";
import { FiEdit, FiDownload } from "react-icons/fi";
import { NOMNCForm } from "@/components/NOMNCForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Users, File, RefreshCw } from "lucide-react";
import TableFooter from "@/components/common/TableFooter";
import { fetchNOMNCForms } from "@/lib/fetchApis";
import { downloadNomncPDF } from "@/lib/api";
import { toast } from "sonner";
import CommonTable from "@/components/common/ReusableTable";
import Search from "@/components/common/SearchInput";
import { cleanParams } from "@/utils/cleanParams";
import { formatDate } from "@/utils/formatDate";

const NOMNC = () => {
  const headers = [
    {
      label: "MRN Number",
      render: (item) =>
        item?.patientNumber ? (
          <span>{item.patientNumber}</span>
        ) : (
          <span className="block text-center w-full">-</span>
        ),
    },

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
      label: "Effective Date",
      render: (item) =>
        item?.serviceEndDate ? (
          <span>{formatDate(item?.serviceEndDate)}</span>
        ) : (
          <span className="block text-center w-full">-</span>
        ),
    },
    {
      label: "Service Type",
      render: (item) =>
        item?.currentServiceType ? (
          <span>{item?.currentServiceType}</span>
        ) : (
          <span className="block text-center w-full">-</span>
        ),
    },
  ];

  const [mode, setMode] = useState<"single" | "bulk" | "dashboard">("single");
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState({});
  const [editingForm, setEditingForm] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [documentData, setDocumentData] = useState({
    totalRecords: 0,
    noMNCUsers: [],
  });

  const [nomncParams, setNomcParams] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  const initialFetch = useRef(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const getForms = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetchNOMNCForms(
        cleanParams({
          page: params?.page ?? nomncParams.page,
          limit: params?.limit ?? nomncParams.limit,
          search: params?.search ?? nomncParams.search,
        })
      );
      setDocumentData(res);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialFetch.current) {
      getForms();
      initialFetch.current = true;
    }
  }, []);

  const totalPages = Math.ceil(documentData.totalRecords / nomncParams.limit);
  const startIndex = (nomncParams.page - 1) * nomncParams.limit;
  const endIndex = Math.min(
    startIndex - 1 + nomncParams.limit,
    documentData.totalRecords
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNomcParams((prev) => ({ ...prev, search: value, page: 1 }));

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      getForms({ search: value, page: 1 });
    }, 500);
  };

  const handlePageChange = (page: number) => {
    setNomcParams((prev) => ({ ...prev, page }));
    getForms({ page });
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = parseInt(e.target.value, 10);
    setNomcParams((prev) => ({ ...prev, page: 1, limit }));
    getForms({ page: 1, limit });
  };

  const handleEditForm = (formData) => {
    setEditingForm(formData);
    setIsEditMode(true);
    setMode("single");
  };

  const handleDownload = async (formData) => {
    setDownloadLoading((prev) => ({ ...prev, [formData._id]: true }));
    try {
      await downloadNomncPDF(formData._id, formData, formData.patientName);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [formData._id]: false }));
    }
  };

  const handleCancelEdit = () => {
    setEditingForm(null);
    setIsEditMode(false);
    setMode("dashboard");
  };

  const actions = [
    {
      label: "Edit",
      render: (item) => (
        <span
          className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors"
          onClick={() => handleEditForm(item)}
          title="Edit"
        >
          <FiEdit size={20} />
        </span>
      ),
    },
    {
      label: "View",
      render: (item) => (
        <span
          className={`relative cursor-pointer text-blue-500 hover:text-blue-700 transition-colors ${
            downloadLoading[item._id] ? "opacity-50" : ""
          }`}
          onClick={() => !downloadLoading[item._id] && handleDownload(item)}
          title="Download"
        >
          {downloadLoading[item._id] ? (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 pt-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Notice of Medicare Non-Coverage
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create NOMNC forms for patients when Medicare coverage is ending.
            Choose between single form creation or bulk processing.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs
            value={mode}
            onValueChange={(value) => {
              if (value === "single" && isEditMode) {
                setEditingForm(null);
                setIsEditMode(false);
              }
              setMode(value as "single" | "bulk" | "dashboard");
            }}
            className="mb-8"
          >
            <TabsList className="grid grid-cols-3 w-full mx-auto sm:max-w-lg sm:overflow-x-auto">
              <TabsTrigger value="single" className="flex items-center gap-2">
                <File className="w-4 h-4 shrink-0" />
                Single Form
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center gap-2">
                <Users className="w-4 h-4  shrink-0" />
                Bulk Creation
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4  shrink-0" />
                Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="mt-8">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <File className="w-5 h-5" />
                    Single NOMNC Form
                  </CardTitle>
                  <CardDescription>
                    Create a single Notice of Medicare Non-Coverage form for an
                    individual patient.
                  </CardDescription>
                </CardHeader>
              </Card>
              <NOMNCForm
                mode="single"
                editingForm={editingForm}
                isEditMode={isEditMode}
                onCancelEdit={handleCancelEdit}
                onFormUpdated={() => {
                  handleCancelEdit();
                  getForms();
                  setMode("dashboard");
                }}
              />
            </TabsContent>

            <TabsContent value="bulk" className="mt-8">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Bulk NOMNC Creation
                  </CardTitle>
                  <CardDescription>
                    Upload a CSV file or paste CSV data to create multiple NOMNC
                    forms at once.
                  </CardDescription>
                </CardHeader>
              </Card>
              <NOMNCForm mode="bulk" />
            </TabsContent>

            <TabsContent value="dashboard" className="mt-8">
              <Card>
                <div className="flex items-center gap-2 justify-between ml-3 mt-3 flex-col sm:flex-row">
                  <div className="flex items-start gap-2">
                    <FileText className="w-6 sm:w-7 h-6 sm:h-7 mt-2 text-blue-500" />
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">
                        NOMNC Dashboard
                      </h1>
                      <p className="text-sm text-gray-400">
                        View and manage submitted NOMNC forms
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 mr-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => getForms()}
                      disabled={loading}
                      className="flex items-center gap-2 h-11"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Search
                      className="w-auto sm:w-[336px]"
                      value={nomncParams?.search}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end mb-3 mr-4"></div>

                <CommonTable
                  headers={headers}
                  data={documentData?.noMNCUsers || []}
                  actions={actions}
                  loading={loading}
                  withCheckbox={false}
                />

                <TableFooter
                  rowsPerPage={nomncParams?.limit}
                  handleRowsPerPageChange={handleRowsPerPageChange}
                  currentPage={nomncParams?.page}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                  totalEntries={documentData?.totalRecords}
                  startIndex={startIndex}
                  endIndex={endIndex}
                />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NOMNC;
