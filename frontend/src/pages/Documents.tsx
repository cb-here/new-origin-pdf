import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Edit, ArrowLeft } from "lucide-react";
import { fetchUsers, fetchDocumentForEdit } from "@/lib/fetchApis";
import { generatePDF } from "@/lib/api";
import TableFooter from "@/components/common/TableFooter";
import { formatDate } from "@/lib/utils/formatDate";
import { toast } from "sonner";

const Documents = () => {
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
    startIndex - 1 + documentParams.limit,
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

      // Small delay to show success message before navigation
      setTimeout(() => {
        navigate("/", { state: { editMode: true } });
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

  const renderSkeleton = () => {
    return Array.from({ length: documentParams.limit }).map((_, idx) => (
      <TableRow key={idx}>
        {Array.from({ length: 8 }).map((__, i) => (
          <TableCell key={i}>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Document Management
          </h1>
        </div>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-3 p-3">
              <h1 className="text-2xl font-semibold leading-none tracking-tight">
                SOC Documents
              </h1>
              <input
                type="text"
                placeholder="Search..."
                className="ml-auto border p-2 rounded w-[400px]"
                value={documentParams?.search}
                onChange={handleSearch}
              />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>SOC Date</TableHead>
                    <TableHead>MRN</TableHead>
                    <TableHead>Clinician</TableHead>
                    {/* <TableHead>Status</TableHead> */}
                    <TableHead>Created</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    renderSkeleton()
                  ) : documentData?.Users?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-4 text-xl"
                      >
                        No records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    documentData?.Users?.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {doc?.patientName || "-"}
                        </TableCell>
                        <TableCell>{formatDate(doc?.socDate) || "-"}</TableCell>
                        <TableCell>{doc?.mrn || "-"}</TableCell>
                        <TableCell>{doc?.clinicianPrintName || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(doc?.createdAt)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {doc?.completedAt || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(doc)}
                              disabled={editingId === doc._id}
                            >
                              {editingId === doc._id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                              ) : (
                                <Edit className="w-4 h-4 mr-1" />
                              )}
                              {editingId === doc._id ? "Loading..." : "Edit"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(doc)}
                              disabled={
                                doc.status === "Draft" ||
                                downloadingId === doc._id
                              }
                            >
                              {downloadingId === doc._id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                              ) : (
                                <Download className="w-4 h-4 mr-1" />
                              )}
                              {downloadingId === doc._id
                                ? "Downloading..."
                                : "Download"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

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
