import type { CompanyDetail,GetPageCompanyParams,ListCompanytResponse } from "../types/company";
import api  from "./api";

export const getPageCompany = async (params: GetPageCompanyParams): Promise<ListCompanytResponse> => {
    try {
    const respone = await api.post("/Companies/get-page-list-company", params);
    return respone.data;
  }
  catch (error) {
    console.error("Error fetching company:", error);
    throw error;
  }
}