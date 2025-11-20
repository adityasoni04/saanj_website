import React, { useMemo, useState } from "react";
import { useGetAllOrders } from "@/http-hooks/order"; // Import order hooks
import { BackendOrder, PopulatedUser } from "@/services/order"; // Import types
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminOrderDetail } from "./AdminOrderDetail"; // <-- Imports the modal

// Helper component to style the status badge
const StatusBadge = ({ status }: { status: string }) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
    if (status === 'Processing') variant = "default";
    if (status === 'Shipped') variant = "outline";
    if (status === 'Delivered') variant = "secondary";
    if (status === 'Cancelled') variant = "destructive";
    return <Badge variant={variant}>{status}</Badge>;
};

// Skeleton Row Component
const OrderRowSkeleton = () => (
    <TableRow>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-6 w-14 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-9 w-24 rounded-md" /></TableCell>
    </TableRow>
);

const OrderManagement = () => {
    const { data: orders = [], isLoading, isError, error } = useGetAllOrders();

    const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleViewDetails = (order: BackendOrder) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading all orders...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-background rounded-lg border border-destructive p-8 text-center">
                <h3 className="text-xl font-semibold text-destructive mb-2">Error</h3>
                <p className="text-muted-foreground">{error?.message || "Could not fetch orders."}</p>
            </div>
        );
    }

    if (orders.length === 0 && !isLoading) {
        return (
            <div className="bg-background rounded-lg border border-border p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground">There are no orders to display yet.</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-background rounded-lg border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <>
                                <OrderRowSkeleton />
                                <OrderRowSkeleton />
                                <OrderRowSkeleton />
                            </>
                        ) : (
                            orders.map((order) => {
                                const user = order.userId as PopulatedUser;
                                return (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-medium">{order?.receiptId || order.razorpayOrder?.receipt}</TableCell>                                        <TableCell>{new Date(order.createdAt).toLocaleDateString('en-GB')}</TableCell>
                                        <TableCell>{user?.email || 'N/A'}</TableCell>
                                        <TableCell>₹{(order.amount / 100).toLocaleString('en-IN')}</TableCell>
                                        <TableCell>
                                            {order.paymentMethod}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={order.isPaid ? "secondary" : "destructive"}>
                                                {order.isPaid ? "Paid" : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={order.orderStatus} />
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* --- 2. ADDED CONDITIONAL RENDER --- */}
            {/* This prevents the modal from crashing when 'selectedOrder' is null */}
            {selectedOrder && (
                <AdminOrderDetail
                    order={selectedOrder}
                    isOpen={isDetailModalOpen}
                    onClose={() => {
                        setIsDetailModalOpen(false);
                        setSelectedOrder(null); // Clear selection on close
                    }}
                />
            )}
        </>
    );
};

export default OrderManagement;