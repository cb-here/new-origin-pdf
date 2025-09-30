import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card, CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, File, RefreshCw } from "lucide-react";
import PatientConsentForm from "@/components/PatientConsentForm";
import { cleanParams } from "@/utils/cleanParams";
import CommonTable from "@/components/common/ReusableTable";
import TableFooter from "@/components/common/TableFooter";
import { toast } from "sonner";
import Search from "@/components/common/SearchInput";
import { fetchConsents } from "@/lib/fetchApis";
import { generatePatientConsentPDF } from "@/lib/api";
import { formatDate } from "@/utils/formatDate";
import { FiDownload, FiEdit } from "react-icons/fi";

const PatientConsent = () => {
  const headers = [
    {
      label: "MRN Number",
      render: (item) =>
        item?.mrn ? (
          <span>{item.mrn}</span>
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
      label: "SOC",
      render: (item) =>
        item?.soc ? (
          <span>{formatDate(item.soc)}</span>
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
    patientConsents: [],
  });

  const [consentParams, setConsentParams] = useState({
    search: "",
    page: 1,
    limit: 10,
  });

  const initialFetch = useRef(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const getConsents = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetchConsents(
        cleanParams({
          page: params?.page ?? consentParams.page,
          limit: params?.limit ?? consentParams.limit,
          search: params?.search ?? consentParams.search,
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
      getConsents();
      initialFetch.current = true;
    }
  }, []);

  const totalPages = Math.ceil(documentData.totalRecords / consentParams.limit);
  const startIndex = (consentParams.page - 1) * consentParams.limit;
  const endIndex = Math.min(
    startIndex - 1 + consentParams.limit,
    documentData.totalRecords
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConsentParams((prev) => ({ ...prev, search: value, page: 1 }));

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      getConsents({ search: value, page: 1 });
    }, 500);
  };

  const handlePageChange = (page: number) => {
    setConsentParams((prev) => ({ ...prev, page }));
    getConsents({ page });
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const limit = parseInt(e.target.value, 10);
    setConsentParams((prev) => ({ ...prev, page: 1, limit }));
    getConsents({ page: 1, limit });
  };

  const handleEditForm = (formData) => {
    setEditingForm(formData);
    setIsEditMode(true);
    setMode("single");
  };

  const handleDownload = async (formData) => {
    setDownloadLoading((prev) => ({ ...prev, [formData._id]: true }));
    try {
      await generatePatientConsentPDF(formData, formData?.patientName, true);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [formData._id]: false }));
    }
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
          <h1 className="text-4xl font-bold mb-4">Client Service Agreement</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Capture patient consent with signatures, or process multiple records
            in bulk.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs
            value={mode}
            onValueChange={(v) => {
              // Reset editing state when switching away from single mode
              if (v !== "single" && isEditMode) {
                setEditingForm(null);
                setIsEditMode(false);
              }
              setMode(v as any);
            }}
            className="mb-8"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
              <TabsTrigger value="single" className="flex items-center gap-2">
                <File className="hidden md:inline w-4 h-4" />
                Single Form
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center gap-2">
                <Users className="hidden md:inline w-4 h-4" />
                Bulk Creation
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2"
              >
                <FileText className="hidden md:inline w-4 h-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="mt-8">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex md:items-center items-start gap-2">
                    <File className="w-5 h-5 flex-shrink-0 md:mt-0 mt-1" />
                    Single Patient Consent Form
                  </CardTitle>
                  <CardDescription>
                    Left-aligned steps, medium layout
                  </CardDescription>
                </CardHeader>
              </Card>
              <PatientConsentForm
                key={isEditMode ? `edit-${editingForm?._id}` : 'new'}
                mode="single"
                editingForm={editingForm}
                isEditMode={isEditMode}
                onCancelEdit={() => {
                  setEditingForm(null);
                  setIsEditMode(false);
                  setMode("dashboard");
                }}
                onFormUpdated={() => {
                  setEditingForm(null);
                  setIsEditMode(false);
                  getConsents();
                  setMode("dashboard");
                }}
                onFormGenerated={() => {
                  getConsents();
                  setMode("dashboard");
                }}
              />
            </TabsContent>

            <TabsContent value="bulk" className="mt-8">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Bulk Patient Consent Creation
                  </CardTitle>
                  <CardDescription>
                    Upload a CSV file to add many consent records
                  </CardDescription>
                </CardHeader>
              </Card>
              <PatientConsentForm mode="bulk" />
            </TabsContent>

            <TabsContent value="dashboard" className="mt-8">
              <Card>
                <div className="flex items-center gap-2 justify-between ml-3 mt-3 flex-col sm:flex-row">
                  <div className="flex items-start gap-2">
                    <FileText className="w-6 sm:w-7 h-6 sm:h-7 mt-2 text-blue-500" />
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">
                        Patient Consent Dashboard
                      </h1>
                      <p className="text-sm text-gray-400">
                        View recent consents
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 mr-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => getConsents()}
                      disabled={loading}
                      className="flex items-center gap-2 h-11"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                      />
                      Refresh
                    </Button>
                    <Search
                      className="w-auto sm:w-[336px]"
                      value={consentParams?.search}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end mb-3 mr-4"></div>

                <CommonTable
                  headers={headers}
                  data={documentData?.patientConsents || []}
                  actions={actions}
                  loading={loading}
                  withCheckbox={false}
                />

                <TableFooter
                  rowsPerPage={consentParams?.limit}
                  handleRowsPerPageChange={handleRowsPerPageChange}
                  currentPage={consentParams?.page}
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

export default PatientConsent;
