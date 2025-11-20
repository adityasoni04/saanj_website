import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/http-hooks/auth'; // Adjust this import path if needed

interface AuthUser {
    role: string;
}

const AdminRoute = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const typedUser = user as AuthUser | null;
    // 1. Show a loading message while checking auth status
    if (isLoading) {
        return <div>Authenticating...</div>;
    }

    // 2. If user is logged in AND is an admin, show the admin page
    if (isAuthenticated && typedUser?.role === 'admin') {
        return <Outlet />; // <Outlet /> renders the child route (your Admin page)
    }

    // 3. If not an admin, redirect to the homepage
    return <Navigate to="/" replace />;
};

export default AdminRoute;