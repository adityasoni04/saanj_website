import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BackendOrder } from "@/services/order";

type OrderStatus = "Pending Payment" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

interface UpdateStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: BackendOrder; // <-- Expect the full order object
    onUpdate: (newStatus: OrderStatus) => void;
    isUpdating: boolean;
}

export const UpdateStatusModal = ({
    isOpen,
    onClose,
    order, // <-- Use the order prop
    onUpdate,
    isUpdating,
}: UpdateStatusModalProps) => {
    // Set initial state from the order's current status
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.orderStatus as OrderStatus);

    // Sync state if the order prop ever changes while modal is open
    useEffect(() => {
        setSelectedStatus(order.orderStatus as OrderStatus);
    }, [order]);

    const handleSubmit = () => {
        onUpdate(selectedStatus);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Status for {order.razorpayOrder.receipt}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Select
                        value={selectedStatus}
                        onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a new status..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending Payment">Pending Payment</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isUpdating}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isUpdating || selectedStatus === order.orderStatus}
                    >
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};