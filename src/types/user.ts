export interface UpdateResponse {
  error:{
    code : string;
    message : string;
  }
}
export interface User{
  uuid : string;
  email: string;
  isVerify : boolean;
  status :number;
  createdAt: string
}
export interface UserResponse {
  data:User,
  error:{
    code : string;
    message : string;
  }
}