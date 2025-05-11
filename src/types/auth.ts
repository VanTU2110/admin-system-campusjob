
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    uuid: string;
    email: string;
    role: number;
  }
  