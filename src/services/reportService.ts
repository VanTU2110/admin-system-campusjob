import api from "./api";
import type { GetPageReportParams, ListReportResponse } from "../types/report";

export const getPageListReport = async (params: GetPageReportParams): Promise<ListReportResponse> => {
    try {
       const response = await api.post("/Report/get-list-page-report", params);
            return response.data;
        } catch (error) {
            console.error("Error fetching report:", error);
            throw error;    
        }    
    }
