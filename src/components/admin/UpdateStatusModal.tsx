import React, { useState, useEffect } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { BackendOrder } from "@/services/order";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; // Import for animation

type OrderStatus = "Pending Payment" | "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";

interface UpdateStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: BackendOrder;
    onUpdate: (status: OrderStatus, trackingId?: string) => void;
    isUpdating: boolean;
}

export const UpdateStatusModal = ({
    isOpen, onClose, order, onUpdate, isUpdating,
}: UpdateStatusModalProps) => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.orderStatus as OrderStatus);
    const [trackingId, setTrackingId] = useState(order.shippingInfo?.trackingId || "");

    useEffect(() => {
        setSelectedStatus(order.orderStatus as OrderStatus);
        setTrackingId(order.shippingInfo?.trackingId || "");
    }, [order]);

    const handleSubmit = () => {
        if (selectedStatus === 'Shipped' && !trackingId.trim()) {
            toast.error("Please provide a tracking ID to mark as 'Shipped'.");
            return;
        }
        onUpdate(selectedStatus, trackingId);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Status for {order.razorpayOrder?.receipt}</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
                        <Label htmlFor="status-select">Order Status</Label>
                        <Select
                            value={selectedStatus}
                            onValueChange={(value: string) => setSelectedStatus(value as OrderStatus)}
                        >
                            <SelectTrigger id="status-select">
                                <SelectValue placeholder="Select a new status..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending Payment" disabled>Pending Payment</SelectItem>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Conditional Tracking ID Input */}
                    <AnimatePresence>
                        {(selectedStatus === 'Shipped' || selectedStatus === 'Out for Delivery') && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-2 pt-2">
                                    <Label htmlFor="trackingId">Delhivery Tracking ID *</Label>
                                    <Input
                                        id="trackingId"
                                        placeholder="Enter tracking ID..."
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value)}
                                    />
                                    {selectedStatus === 'Shipped' && (
                                        <DialogDescription className="text-xs">
                                            Required to mark order as "Shipped".
                                        </DialogDescription>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isUpdating}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isUpdating || (selectedStatus === order.orderStatus && trackingId === (order.shippingInfo?.trackingId || ""))}
                    >
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
