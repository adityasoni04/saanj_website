import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ExchangeRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
    isSubmitting: boolean;
}

export const ExchangeRequestModal = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting
}: ExchangeRequestModalProps) => {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if (!reason.trim()) return;
        onSubmit(reason);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request an Exchange</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for your exchange request. This is mandatory.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="exchange-reason" className="font-semibold">
                        Reason for Exchange *
                    </Label>
                    <Textarea
                        id="exchange-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g., Wrong item delivered, Product is damaged..."
                        className="mt-2 min-h-[100px]"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !reason.trim()}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};