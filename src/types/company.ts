import type { Location } from "./location";
export interface CompanyDetail {
    userUuid: string;
    uuid: string;
    name: string;
    description: string;
    email: string;
    phoneNumber: string;
    tp: Location; // Thành phố
    qh: Location; // Quận/huyện
    xa: Location; // Xã/phường
  }
  export interface GetPageCompanyParams {
    pageSize: number;
    page: number;  
    keyword?: string;
}
 export interface ListCompanytResponse {
    data: {
      items: CompanyDetail[];
      pagination: {
        totalCount: number;
        totalPage: number;
      };
    };
    error: {
      code: string;
      message: string;
    };
  }