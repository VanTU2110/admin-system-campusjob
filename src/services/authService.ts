import api from "./api";

import type { LoginResponse, LoginInput } from "../types/auth";
import type { ApiResponse } from '../types/common';



// Đăng nhập công ty
export const login = async (
  data: LoginInput
): Promise<ApiResponse<LoginResponse>> => {
  const res = await api.post('/auth/login', data);
  return res.data;
};