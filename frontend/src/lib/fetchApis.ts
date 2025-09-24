import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const fetchUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await axios.get(`${API_BASE_URL}/users`, {
    params: { page: 1, limit: 10, ...params },
  });
  return response.data?.Response;
};

export const fetchDocumentForEdit = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/pdf/${id}/edit`);
  return response.data?.Response;
};
    