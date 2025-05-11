import api from "./api";

import type { SkillListResponse,GetPageSkillParams,SkillCreateInput, SkillCreateReposnse } from "../types/skill";

export const getPageListSkill = async (params: GetPageSkillParams):Promise<SkillListResponse> => {
  try {
    const response = await api.post<SkillListResponse>(`/Skill/get-list-page-skill`, params);
    return response.data;
  } catch (error) {
    console.error("Error fetching skills:", error);
    throw error;
  }
}
export const createSkill = async (params: SkillCreateInput):Promise<SkillCreateReposnse> => {
  try {
    const response = await api.post<SkillCreateReposnse>(`/Skill/create-skill`, params);
    return response.data;
  } catch (error) {
    console.error("Error creating skill:", error);
    throw error;
  }
}

