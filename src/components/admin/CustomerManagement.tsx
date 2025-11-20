import React, { useMemo, useEffect } from "react";
import { useGetAllUsers } from "@/http-hooks/user"; // Import the new hook
import { User } from "@/services/user"; // Import the User type
import { toast } from "react-hot-toast"; // Import toast
import { Loader2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- 1. FIX: Moved Skeleton component outside ---
// Skeleton Row Component
const UserRowSkeleton = () => (
    <TableRow>
        <TableCell className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
        </TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    </TableRow>
);

const CustomerManagement = () => {
    // 1. Fetch all users using the admin hook
    const { data: users = [], isLoading, isError, error } = useGetAllUsers();

    // 2. Handle toast on error
    useEffect(() => {
        if (isError && error) {
            console.error("Error fetching users:", error);
            toast.error(error.message || "Could not fetch users.");
        }
    }, [isError, error]);

    if (isLoading) { // <-- This check can now find UserRowSkeleton
        return (
             <div className="bg-background rounded-lg border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined On</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <UserRowSkeleton />
                        <UserRowSkeleton />
                        <UserRowSkeleton />
                    </TableBody>
                </Table>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="bg-background rounded-lg border border-destructive p-8 text-center">
                <h3 className="text-xl font-semibold text-destructive mb-2">Error</h3>
                <p className="text-muted-foreground">{error?.message || "Could not fetch users."}</p>
            </div>
        );
    }

    if (users.length === 0) {
         return (
            <div className="bg-background rounded-lg border border-border p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No Customers Found</h3>
                <p className="text-muted-foreground">There are no customers to display yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-background rounded-lg border border-border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined On</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={(user as any).image} alt={user.displayName} />
                                        <AvatarFallback>
                                            {user.displayName?.charAt(0).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{user.displayName}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString('en-GB')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CustomerManagement;