"use client";

import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { useZodForm } from "@/lib/hooks/useZodForm";
import type { AddressDTO } from "@/lib/types/address";
import { addressSchema } from "@/lib/validators/address";
import {
  createAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
  updateAddressAction,
} from "@/server/actions/address.actions";
import { AddressFields } from "./AddressFields";

const emptyAddress = { fullName: "", phone: "", line1: "", line2: "", city: "", state: undefined, postalCode: "" };

function AddressForm({ editing, onDone }: { editing: AddressDTO | null; onDone: () => void }) {
  const form = useZodForm(
    addressSchema,
    editing
      ? { fullName: editing.fullName, phone: editing.phone, line1: editing.line1, line2: editing.line2 ?? "", city: editing.city, state: editing.state as never, postalCode: editing.postalCode ?? "" }
      : (emptyAddress as never),
  );
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string>();

  const submit = form.handleSubmit(async (values) => {
    setPending(true);
    setFormError(undefined);
    const res = editing
      ? await updateAddressAction({ addressId: editing.id, address: values })
      : await createAddressAction(values);
    setPending(false);
    if (!res.ok) {
      setFormError(res.error);
      for (const [field, messages] of Object.entries(res.fieldErrors ?? {})) {
        form.setError(field as never, { message: messages[0] });
      }
      return;
    }
    toast.success(editing ? "Address updated" : "Address saved");
    onDone();
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <AddressFields form={form as unknown as UseFormReturn<FieldValues>} />
      {formError && <p role="alert" className="rounded-control bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{formError}</p>}
      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
        <Button type="submit" isLoading={pending}>{editing ? "Save changes" : "Save address"}</Button>
      </div>
    </form>
  );
}

export function AddressBook({ addresses }: { addresses: AddressDTO[] }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<null | { mode: "form"; editing: AddressDTO | null } | { mode: "delete"; address: AddressDTO }>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const close = () => {
    setDialog(null);
    router.refresh();
  };

  async function makeDefault(a: AddressDTO) {
    setBusy(a.id);
    const res = await setDefaultAddressAction({ addressId: a.id });
    setBusy(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Default address updated");
    router.refresh();
  }

  async function confirmDelete(a: AddressDTO) {
    setBusy(a.id);
    const res = await deleteAddressAction({ addressId: a.id });
    setBusy(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Address removed");
    close();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-fg-muted">{addresses.length === 0 ? "No saved addresses yet." : `${addresses.length} saved`}</p>
        <Button onClick={() => setDialog({ mode: "form", editing: null })} startIcon={<Plus className="h-4 w-4" />}>Add address</Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="Add your first address" description="Save an address once and check out faster every time." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="flex flex-col rounded-card border border-border bg-surface p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="font-display text-lg font-semibold">{a.fullName}</p>
                {a.isDefault && <Badge tone="primary">Default</Badge>}
              </div>
              <address className="flex-1 text-[0.9375rem] not-italic leading-relaxed text-fg-muted">
                {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />{a.city}, {a.state}{a.postalCode ? ` ${a.postalCode}` : ""}<br />
                <span className="font-mono text-sm tabular">{a.phone}</span>
              </address>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                <Button size="sm" variant="outline" onClick={() => setDialog({ mode: "form", editing: a })} startIcon={<Pencil className="h-3.5 w-3.5" />}>Edit</Button>
                {!a.isDefault && (
                  <Button size="sm" variant="ghost" isLoading={busy === a.id} onClick={() => makeDefault(a)} startIcon={<Star className="h-3.5 w-3.5" />}>Make default</Button>
                )}
                <Button size="sm" variant="ghost" className="ml-auto text-danger" onClick={() => setDialog({ mode: "delete", address: a })} startIcon={<Trash2 className="h-3.5 w-3.5" />}>Remove</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={dialog?.mode === "form"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent title={dialog?.mode === "form" && dialog.editing ? "Edit address" : "New address"} description="Where should we deliver?" className="max-w-xl">
          {dialog?.mode === "form" && <AddressForm key={dialog.editing?.id ?? "new"} editing={dialog.editing} onDone={close} />}
        </DialogContent>
      </Dialog>

      <Dialog open={dialog?.mode === "delete"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent title="Remove this address?" description={dialog?.mode === "delete" ? `${dialog.address.line1}, ${dialog.address.city}` : undefined}>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDialog(null)}>Keep it</Button>
            <Button variant="danger" isLoading={dialog?.mode === "delete" && busy === dialog.address.id} onClick={() => dialog?.mode === "delete" && confirmDelete(dialog.address)}>Remove</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
