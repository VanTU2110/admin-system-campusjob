import type { Pagination } from "./pagination";

export interface SkillItem {
    uuid: string;
    name: string;
    }
    export interface SkillListResponse {
        data: {
            items: SkillItem[];
            pagination: Pagination;
        }
        error: {
            code: string;
            message: string;
          };
        }
    export interface SkillCreateInput {
        name: string;
    }
    export interface GetPageSkillParams {
        pageSize: number;
        page: number;  
        keyword?: string;
    }
    export interface SkillCreateReposnse {
        data: SkillItem;
        error: {
            code: string;
            message: string;
          };
    }