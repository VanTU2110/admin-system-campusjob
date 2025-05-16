import api from './api';
import type { UpdateResponse, UserResponse } from '../types/user';
 export const updateStatus = async( uuid: string):Promise<UpdateResponse> => {
    try {
        const response = await api.post(`/User/update-status`,{uuid});
        return response.data;
    } catch (error) {
        throw new Error('Failed to update status');
    }
}
export const detailUser = async(uuid:string):Promise<UserResponse> =>{
    try {
        const response = await api.post<UserResponse>(`User/detail-user`,{uuid});
        return response.data;
        
    } catch (error) {
        console.error("Error get detail user",error);
        throw error;
    } 
           
    }