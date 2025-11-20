import { fetcher } from '../lib/fetcher'; 

export interface User {
    _id: string;
    displayName: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
}

export const getAllUsers = async (): Promise<User[]> => {
    return fetcher('/users', { method: 'GET' });
};