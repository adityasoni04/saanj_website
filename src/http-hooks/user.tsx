import { useQuery } from '@tanstack/react-query';
import { getAllUsers, User } from '@/services/user'; // Adjust path
import { useAuth } from '@/http-hooks/auth';
import { toast } from 'react-hot-toast';

/**
 * [Admin] Hook to fetch ALL users.
 */
export const useGetAllUsers = () => {
    const { isAuthenticated, user } = useAuth();
    // Check if the user is authenticated and has the 'admin' role
    const isAdmin = isAuthenticated && (user as { role: string })?.role === 'admin';

    return useQuery<User[], Error>({
        queryKey: ['users', 'all'], // Key for "all users"
        queryFn: getAllUsers,
        enabled: isAdmin, // Only run this query if the user is an admin
    });
};