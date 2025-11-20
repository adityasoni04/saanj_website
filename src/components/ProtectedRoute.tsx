import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/http-hooks/auth'; // Adjust path as needed
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;