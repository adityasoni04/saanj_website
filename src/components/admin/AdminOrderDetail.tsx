import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { BackendOrder, PopulatedOrderProduct } from "@/services/order";
import { useUpdateOrderStatus, useManageExchange } from "@/http-hooks/order";
import { UpdateStatusModal } from "./UpdateStatusModal"; // We will create this next
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface AdminOrderDetailProps {
    order: BackendOrder;
    isOpen: boolean;
    onClose: () => void;
}

type OrderStatus = "Pending Payment" | "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";

export const AdminOrderDetail = ({ order, isOpen, onClose }: AdminOrderDetailProps) => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
    const { mutate: manageExchange, isPending: isManagingExchange } = useManageExchange();
    const orderProducts = (order.products || []) as PopulatedOrderProduct[];
    const shipping = order.shippingAddress;

    const handleUpdateStatus = (newStatus: OrderStatus, trackingId?: string) => {
        updateStatus({ orderId: order._id, status: newStatus, trackingId }, {
            onSuccess: () => {
                toast.success("Status updated!");
                setIsUpdateModalOpen(false);
                onClose();
            },
            onError: (err: any) => {
                toast.error(err.message || "Failed to update status.");
            }
        });
    };

    const handleExchangeAction = (action: 'approve' | 'reject') => {
        manageExchange({ orderId: order._id, action }, {
            onSuccess: (updatedOrder) => {
                toast.success(`Exchange ${updatedOrder.exchangeStatus}!`);
                onClose(); // <-- ADD THIS LINE
            },
            // onError is already handled by the hook
        });
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-3xl w-[90vw] h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Order Details: {order.razorpayOrder?.receipt}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {order.orderStatus === 'Exchange Requested' && (
                            <div className="border border-yellow-500 bg-yellow-50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg text-yellow-800 mb-2">Exchange Request Pending</h3>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground block">Reason Provided by Customer:</Label>
                                    <p className="text-sm text-yellow-900 italic">"{order.exchangeReason}"</p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleExchangeAction('approve')}
                                        disabled={isManagingExchange}
                                    >
                                        {isManagingExchange && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Approve Exchange
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleExchangeAction('reject')}
                                        disabled={isManagingExchange}
                                    >
                                        {isManagingExchange && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Reject Exchange
                                    </Button>
                                </div>
                            </div>
                        )}
                        {/* Items List */}
                        <h3 className="font-semibold text-lg text-primary mb-2">Items ({orderProducts.length})</h3>
                        <div className="space-y-4 border-b pb-4">
                            {orderProducts.map((item, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                    <img src={item.productDetails.images?.[0] || '/placeholder.png'} alt={item.productDetails.productName} className="w-16 h-16 object-cover rounded-lg bg-muted" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-primary truncate">{item.productDetails.productName}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-primary">₹{(item.price / 100 * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Details */}
                            <div>
                                <h3 className="font-semibold text-lg text-primary mb-2">Shipping Address</h3>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p className="font-medium text-foreground">{shipping.firstName} {shipping.lastName}</p>
                                    <p>{shipping.address}</p>
                                    <p>{shipping.city}, {shipping.state} - {shipping.pincode}</p>
                                    <p>{shipping.phone}</p>
                                    <p>{shipping.email}</p>
                                </div>
                            </div>
                            {/* Payment Details */}
                            <div>
                                <h3 className="font-semibold text-lg text-primary mb-2">Payment & Status</h3>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground block">Status</Label>
                                        <p className="font-semibold">{order.orderStatus}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground block">Payment</Label>
                                        <Badge variant={order.isPaid ? "secondary" : "destructive"} className="mt-1">{order.isPaid ? "Paid" : "Pending"}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground block">Total</Label>
                                        <p className="font-semibold text-lg text-accent mt-0.5">₹{(order.amount / 100).toLocaleString('en-IN')}</p>
                                    </div>
                                    {/* Show Tracking ID if it exists */}
                                    {order.shippingInfo?.trackingId && (
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground block">Tracking ID</Label>
                                            <p className="font-mono text-sm">{order.shippingInfo.trackingId}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="pt-4 border-t border-border">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <Button onClick={() => setIsUpdateModalOpen(true)}>Update Status</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isUpdateModalOpen && (
                <UpdateStatusModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    order={order}
                    isUpdating={isUpdating}
                    onUpdate={handleUpdateStatus}
                />
            )}
        </>
    );
};
