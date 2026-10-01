"use client";

import { Banknote, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { orderStatusLabels, type OrderStatus } from "@/lib/config/shop";
import { allowedNextStatuses, isFinalStatus } from "@/lib/orders/transitions";
import { markOrderPaidAction, resendConfirmationAction, updateOrderStatusAction } from "@/server/actions/admin/order.actions";

interface Props {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: "unpaid" | "paid" | "refunded";
}

export function OrderStatusPanel({ orderNumber, status, paymentStatus }: Props) {
  const router = useRouter();
  const options = allowedNextStatuses(status);
  const [next, setNext] = useState<string>("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<null | "status" | "paid" | "email">(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  async function applyStatus() {
    setBusy("status");
    const res = await updateOrderStatusAction({ orderNumber, status: next, note: note || undefined });
    setBusy(null);
    setConfirmCancel(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(`Order marked ${orderStatusLabels[next as OrderStatus].toLowerCase()}. The customer has been emailed.`);
    setNext("");
    setNote("");
    router.refresh();
  }

  async function markPaid() {
    setBusy("paid");
    const res = await markOrderPaidAction({ orderNumber });
    setBusy(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Marked as paid");
    router.refresh();
  }

  async function resend() {
    setBusy("email");
    const res = await resendConfirmationAction({ orderNumber });
    setBusy(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Confirmation email sent");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {isFinalStatus(status) ? (
        <p className="rounded-control bg-surface-2 px-4 py-3 text-sm text-fg-muted">
          This order is {orderStatusLabels[status].toLowerCase()}, so its status can&apos;t change any more.
        </p>
      ) : (
        <div className="space-y-4">
          <Field label="Move to">
            <Select
              value={next}
              onValueChange={setNext}
              placeholder="Choose the next status"
              options={options.map((s) => ({ value: s, label: orderStatusLabels[s] }))}
            />
          </Field>
          <Field label="Note for the customer (optional)" hint="Included in the email, for example a tracking number.">
            <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} />
          </Field>
          <Button
            className="w-full"
            disabled={!next}
            isLoading={busy === "status"}
            onClick={() => (next === "cancelled" ? setConfirmCancel(true) : applyStatus())}
            variant={next === "cancelled" ? "danger" : "primary"}
          >
            {next ? `Mark as ${orderStatusLabels[next as OrderStatus].toLowerCase()}` : "Update status"}
          </Button>
        </div>
      )}

      <div className="space-y-3 border-t border-border pt-5">
        {paymentStatus === "unpaid" && status !== "cancelled" && (
          <Button variant="outline" className="w-full" isLoading={busy === "paid"} onClick={markPaid} startIcon={<Banknote className="h-4 w-4" />}>
            Mark as paid
          </Button>
        )}
        <Button variant="outline" className="w-full" isLoading={busy === "email"} onClick={resend} startIcon={<Mail className="h-4 w-4" />}>
          Resend confirmation email
        </Button>
      </div>

      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent title="Cancel this order?" description="The items go back into stock and the customer is emailed. This can't be undone.">
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setConfirmCancel(false)}>Keep order</Button>
            <Button variant="danger" isLoading={busy === "status"} onClick={applyStatus}>Cancel order</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
