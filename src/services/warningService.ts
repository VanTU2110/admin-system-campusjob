import api from "./api";
import type { ListWarningResponse, GetPageWarningParams, DetailWarningResponse ,CreateWarningParams} from "../types/warning";

export const getPageListWarning = async (params: GetPageWarningParams): Promise<ListWarningResponse> => {
  try {
    const response = await api.post<ListWarningResponse>(`/UserWarning/get-page-list-warning`, params);
    return response.data;
  } catch (error) {
    console.error("Error fetching warnings:", error);
    throw error;
  }
}
export const createWarning = async (params: CreateWarningParams): Promise<DetailWarningResponse> => {
  try {
    const response = await api.post<DetailWarningResponse>(`/UserWarning/create-warning`, params);
    return response.data;
  } catch (error) {
    console.error("Error creating warning:", error);
    throw error;
  }
}