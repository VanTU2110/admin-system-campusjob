import api from "./api";
import type { ListStudentResponse, GetPageStudentParams,DetailStudentResponse} from "../types/student";

export const getPageListStudent = async (params: GetPageStudentParams): Promise<ListStudentResponse> => {
  try {
    const response = await api.post<ListStudentResponse>(`/Student/get-page-list-student`, params);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};
export const getStudentDetail = async (uuid: string): Promise<DetailStudentResponse> => {
  const res = await api.post('/Student/detail-student-by-studentuuid', { uuid });
  return res.data;
}