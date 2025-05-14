import api from './api';
import type { UpdateResponse } from '../types/user';
 export const updateStatus = async( uuid: string):Promise<UpdateResponse> => {
    try {
        const response = await api.post(`/Users/update-status`,uuid);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update status');
    }
}