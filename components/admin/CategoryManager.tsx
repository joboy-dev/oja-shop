"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { get } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useZodForm } from "@/lib/hooks/useZodForm";
import type { AdminCategory } from "@/lib/types/admin";
import { categoryFormSchema } from "@/lib/validators/admin";
import { deleteCategoryAction, saveCategoryAction } from "@/server/actions/admin/category.actions";
import { ImageSlot } from "./ImageSlot";

function CategoryForm({ editing, onDone, nextOrder }: { editing: AdminCategory | null; onDone: () => void; nextOrder: number }) {
  const form = useZodForm(categoryFormSchema, {
    name: editing?.name ?? "",
    slug: editing?.slug ?? "",
    description: editing?.description ?? "",
    sortOrder: String(editing?.sortOrder ?? nextOrder),
    uploadId: undefined,
  });
  const [uploadId, setUploadId] = useState<string>();
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string>();
  const err = (p: string) => get(form.formState.errors, p)?.message as string | undefined;

  const submit = form.handleSubmit(async () => {
    setPending(true);
    setFormError(undefined);
    const res = await saveCategoryAction({ categoryId: editing?.id, category: { ...form.getValues(), uploadId } });
    setPending(false);
    if (!res.ok) {
      setFormError(res.error);
      for (const [field, messages] of Object.entries(res.fieldErrors ?? {})) form.setError(field as never, { message: messages[0] });
      return;
    }
    toast.success(editing ? "Category saved" : "Category created");
    onDone();
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <Field label="Name" error={err("name")} required><Input {...form.register("name")} /></Field>
      <Field label="Description" error={err("description")} hint="Shown at the top of the category page."><Textarea rows={3} {...form.register("description")} /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Page URL" error={err("slug")} hint="Blank builds it from the name."><Input {...form.register("slug")} /></Field>
        <Field label="Order" error={err("sortOrder")} hint="Lower numbers come first."><Input inputMode="numeric" {...form.register("sortOrder")} /></Field>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Image</p>
        <ImageSlot currentUrl={editing?.imageUrl ?? null} onUploaded={setUploadId} />
      </div>
      {formError && <p role="alert" className="rounded-control bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{formError}</p>}
      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
        <Button type="submit" isLoading={pending}>{editing ? "Save changes" : "Create category"}</Button>
      </div>
    </form>
  );
}

export function CategoryManager({ categories }: { categories: AdminCategory[] }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<null | { mode: "form"; editing: AdminCategory | null } | { mode: "delete"; category: AdminCategory }>(null);
  const [deleting, setDeleting] = useState(false);
  const close = () => {
    setDialog(null);
    router.refresh();
  };

  async function remove(c: AdminCategory) {
    setDeleting(true);
    const res = await deleteCategoryAction({ id: c.id });
    setDeleting(false);
    if (!res.ok) {
      setDialog(null);
      return toast.error(res.error);
    }
    toast.success(`Deleted ${c.name}`);
    close();
  }

  const nextOrder = categories.reduce((m, c) => Math.max(m, c.sortOrder), 0) + 1;

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setDialog({ mode: "form", editing: null })} startIcon={<Plus className="h-4 w-4" />}>Add category</Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Products need a category, so add one first." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.id} className="overflow-hidden rounded-card border border-border bg-surface">
              <div className="relative aspect-[16/9] bg-surface-2">{c.imageUrl && <Image src={c.imageUrl} alt="" fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />}</div>
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg">{c.name}</h2>
                  <span className="font-mono text-sm tabular text-fg-muted">{c.productCount} {c.productCount === 1 ? "product" : "products"}</span>
                </div>
                <p className="mt-0.5 font-mono text-xs text-fg-muted">/shop/{c.slug}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setDialog({ mode: "form", editing: c })} startIcon={<Pencil className="h-3.5 w-3.5" />}>Edit</Button>
                  <Button size="sm" variant="ghost" className="ml-auto text-danger" onClick={() => setDialog({ mode: "delete", category: c })} startIcon={<Trash2 className="h-3.5 w-3.5" />}>Delete</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={dialog?.mode === "form"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent title={dialog?.mode === "form" && dialog.editing ? "Edit category" : "New category"} className="max-w-xl">
          {dialog?.mode === "form" && <CategoryForm key={dialog.editing?.id ?? "new"} editing={dialog.editing} onDone={close} nextOrder={nextOrder} />}
        </DialogContent>
      </Dialog>

      <Dialog open={dialog?.mode === "delete"} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent title="Delete this category?" description={dialog?.mode === "delete" ? (dialog.category.productCount > 0 ? `“${dialog.category.name}” still has ${dialog.category.productCount} products. Move or delete them first.` : `“${dialog.category.name}” will be removed.`) : undefined}>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDialog(null)}>Keep it</Button>
            <Button variant="danger" isLoading={deleting} disabled={dialog?.mode === "delete" && dialog.category.productCount > 0} onClick={() => dialog?.mode === "delete" && remove(dialog.category)}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
