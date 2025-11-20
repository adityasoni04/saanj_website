import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/http-hooks/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, CreditCard, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label"; // <-- 1. FIX: Added Label import

const MyProfile = () => {
    const navigate = useNavigate();
    
    // --- 2. FIX: Removed 'isError' from destructuring ---
    const { user, isLoading, isAuthenticated, logout } = useAuth();

    // Handle loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24 pb-16">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    // --- 3. FIX: Check 'isAuthenticated' or just '!user' ---
    // If loading is done and user is still not authenticated, redirect.
    if (!isAuthenticated || !user) {
        sonnerToast.error("You must be logged in to view this page.");
        navigate('/');
        return null; // Redirecting...
    }

    // Type assertion for user data
    const typedUser = user as { 
        displayName: string; 
        email: string; 
        image: string;
        role: string; 
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        sonnerToast.success("You have been logged out.");
    };

    return (
        <div className="min-h-screen">
            {/* Navbar and Footer are in App.js */}
            <main className="pt-24 pb-16 flex-grow">
                <div className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="font-serif text-4xl font-bold text-primary mb-8">
                            My Account
                        </h1>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* --- Sidebar --- */}
                        <aside className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-card border border-border rounded-lg p-4 sticky top-28"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={typedUser.image} alt={typedUser.displayName} />
                                        <AvatarFallback className="text-2xl">
                                            {typedUser.displayName?.charAt(0).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <h3 className="font-semibold text-lg truncate">{typedUser.displayName}</h3>
                                        <p className="text-sm text-muted-foreground truncate">{typedUser.email}</p>
                                    </div>
                                </div>
                                <nav className="flex flex-col space-y-2">
                                    <Button variant="ghost" className="justify-start gap-2 text-primary bg-accent/20" onClick={() => navigate('/profile')}>
                                        <UserIcon className="h-4 w-4" />
                                        My Profile
                                    </Button>
                                    <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate('/profile/orders')}>
                                        <CreditCard className="h-4 w-4" />
                                        My Orders
                                    </Button>
                                    {typedUser.role === 'admin' && (
                                         <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate('/admin')}>
                                            <ShieldCheck className="h-4 w-4" />
                                            Admin Panel
                                        </Button>
                                    )}
                                    <Button variant="ghost" className="justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                                        <LogOut className="h-4 w-4" />
                                        Log Out
                                    </Button>
                                </nav>
                            </motion.div>
                        </aside>

                        {/* --- Main Content --- */}
                        <main className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-card border border-border rounded-lg p-6 lg:p-8"
                            >
                                <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                                    Profile Details
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                                        <p className="text-lg font-medium text-foreground">{typedUser.displayName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                                        <p className="text-lg font-medium text-foreground">{typedUser.email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Account Role</Label>
                                        <p className="text-lg font-medium text-foreground capitalize">{typedUser.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </main>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyProfile;