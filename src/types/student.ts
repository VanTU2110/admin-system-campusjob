import type { Location } from "./location";
import type { Pagination } from "./pagination";

export interface StudentDetail {
    uuid: string;
    userUuid: string;
    fullname: string;
    phoneNumber: string;
    gender: number; // e.g., 0 for male, 1 for female, etc.
    birthday: string; // ISO 8601 date string
    university: string;
    major: string;
    tp: Location; // Province/City
    qh: Location; // District
    xa: Location; // Ward
  }
  export interface DetailStudentResponse {
    error: {
      code: string; // e.g., "success", "error"
      message: string;
    };
    data: StudentDetail;
  }
  export interface ListStudentResponse {
    data: {
      items: StudentDetail[];
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
export interface GetPageStudentParams {
    pageSize: number;
    page: number;  
    keyword?: string;
}