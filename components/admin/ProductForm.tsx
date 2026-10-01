"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, get, type Control, type FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { useZodForm } from "@/lib/hooks/useZodForm";
import { MAX_IMAGES_PER_PRODUCT } from "@/lib/media/rules";
import type { AdminProductDetail } from "@/lib/types/admin";
import { productFormSchema } from "@/lib/validators/admin";
import { deleteProductAction, saveProductAction } from "@/server/actions/admin/product.actions";
import { ImageUploader, type ImageItem } from "./ImageUploader";

interface Props {
  product?: AdminProductDetail;
  categories: { id: string; name: string }[];
}

/** Forwards the id / invalid / aria props that <Field> injects down to the Select inside a Controller. */
function CategorySelect({ control, categories, id, invalid, "aria-describedby": d }: { control: Control<FieldValues>; categories: Props["categories"]; id?: string; invalid?: boolean; "aria-describedby"?: string }) {
  return (
    <Controller
      control={control}
      name="categoryId"
      render={({ field }) => (
        <Select id={id} invalid={invalid} aria-describedby={d} value={field.value ?? ""} onValueChange={field.onChange} placeholder="Choose a category" options={categories.map((c) => ({ value: c.id, label: c.name }))} />
      )}
    />
  );
}

const toNaira = (kobo: number | null) => (kobo == null ? "" : String(kobo / 100));

export function ProductForm({ product, categories }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<ImageItem[]>(() =>
    (product?.images ?? []).map((i) => ({ key: i.id, imageId: i.id, url: i.url, alt: i.alt, status: "done", progress: 100 })),
  );
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useZodForm(productFormSchema, {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    categoryId: product?.categoryId ?? "",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    price: toNaira(product?.price ?? null),
    compareAtPrice: toNaira(product?.compareAtPrice ?? null),
    stock: String(product?.stock ?? 0),
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    materials: product?.materials ?? "",
    care: product?.care ?? "",
    images: [],
  });
  const { register, control, handleSubmit, setValue, getValues, setError, formState } = form;
  const errors = formState.errors;
  const err = (path: string) => get(errors, path)?.message as string | undefined;
  const loose = control as unknown as Control<FieldValues>;

  const mapImages = () =>
    items.filter((i) => i.status === "done").map((i) => (i.uploadId ? { uploadId: i.uploadId, alt: i.alt } : { imageId: i.imageId, alt: i.alt }));

  const valid = async () => {
    setServerError(undefined);
    setSaving(true);
    // Validation transformed prices to kobo; the server re-validates the raw text, so send that.
    const res = await saveProductAction({ productId: product?.id, product: getValues() });
    setSaving(false);
    if (!res.ok) {
      setServerError(res.error);
      for (const [field, messages] of Object.entries(res.fieldErrors ?? {})) setError(field as never, { message: messages[0] });
      return toast.error(res.error);
    }
    toast.success(product ? "Product saved" : "Product created");
    router.push("/admin/products");
    router.refresh();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.some((i) => i.status === "uploading")) return void toast.error("Wait for the photos to finish uploading.");
    if (items.some((i) => i.status === "error")) return void toast.error("Remove or retry the photos that failed to upload.");
    setValue("images", mapImages() as never);
    void handleSubmit(valid, () => {
      toast.error("Please fix the highlighted fields.");
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    })(e);
  };

  async function remove() {
    if (!product) return;
    setDeleting(true);
    const res = await deleteProductAction({ id: product.id });
    setDeleting(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Product deleted");
    router.push("/admin/products");
    router.refresh();
  }

  const imageErrors = items.map((_, i) => err(`images.${i}.alt`));
  const card = "rounded-card border border-border bg-surface p-6";

  return (
    <form onSubmit={onSubmit} noValidate className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <section className={card}>
          <h2 className="mb-5 text-xl">Basics</h2>
          <div className="space-y-5">
            <Field label="Name" error={err("name")} required>
              <Input placeholder="Adire Eleko Throw" {...register("name")} />
            </Field>
            <Field label="Short summary" error={err("shortDescription")} hint="One line shown on product cards and in search." required>
              <Input {...register("shortDescription")} />
            </Field>
            <Field label="Description" error={err("description")} required>
              <Textarea rows={7} {...register("description")} />
            </Field>
            <Field label="Page URL" error={err("slug")} hint="Leave blank to build it from the name. Letters, numbers and dashes only.">
              <Input placeholder="adire-eleko-throw" startAdornment={<span className="text-sm">/</span>} {...register("slug")} />
            </Field>
          </div>
        </section>

        <section className={card}>
          <h2 className="mb-1 text-xl">Photos</h2>
          <p className="mb-5 text-sm text-fg-muted">The first photo is the cover and the second appears when someone hovers over the card. Drag to reorder.</p>
          <ImageUploader items={items} setItems={setItems} max={MAX_IMAGES_PER_PRODUCT} purpose="product" altErrors={imageErrors} />
          {err("images") && <p role="alert" className="mt-3 text-sm font-medium text-danger">{err("images")}</p>}
        </section>

        <section className={card}>
          <h2 className="mb-5 text-xl">Details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Materials" error={err("materials")} hint="For example: 100% cotton, natural indigo."><Input {...register("materials")} /></Field>
            <Field label="Care" error={err("care")} hint="How to wash and look after it."><Input {...register("care")} /></Field>
          </div>
        </section>

        {product && (
          <section className="rounded-card border border-danger/30 p-6">
            <h2 className="text-xl">Delete this product</h2>
            <p className="mt-1.5 text-sm text-fg-muted">It disappears from the shop and from customers&apos; bags and wishlists. Past orders keep their own copy of the details.</p>
            <Button type="button" variant="danger" className="mt-4" onClick={() => setConfirmDelete(true)} startIcon={<Trash2 className="h-4 w-4" />}>Delete product</Button>
          </section>
        )}
      </div>

      <aside className="space-y-6 lg:sticky lg:top-6">
        <section className={card}>
          <h2 className="mb-4 text-xl">Status</h2>
          <div className="space-y-4">
            <Controller control={control} name="isActive" render={({ field }) => <Switch label="Visible in the shop" checked={!!field.value} onCheckedChange={field.onChange} />} />
            <Controller control={control} name="isFeatured" render={({ field }) => <Switch label="Show on the home page" checked={!!field.value} onCheckedChange={field.onChange} />} />
          </div>
        </section>
        <section className={card}>
          <h2 className="mb-4 text-xl">Pricing</h2>
          <div className="space-y-4">
            <Field label="Price" error={err("price")} required><Input inputMode="decimal" startAdornment="₦" placeholder="48,000" {...register("price")} /></Field>
            <Field label="Was price (optional)" error={err("compareAtPrice")} hint="Shows a strike-through and a sale badge."><Input inputMode="decimal" startAdornment="₦" {...register("compareAtPrice")} /></Field>
          </div>
        </section>
        <section className={card}>
          <h2 className="mb-4 text-xl">Organise</h2>
          <div className="space-y-4">
            <Field label="Category" error={err("categoryId")} required><CategorySelect control={loose} categories={categories} /></Field>
            <Field label="In stock" error={err("stock")} hint="0 shows as sold out."><Input inputMode="numeric" {...register("stock")} /></Field>
          </div>
        </section>
        {serverError && <p role="alert" className="rounded-control bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{serverError}</p>}
        <div className="flex gap-3 max-lg:bg-surface max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-20 max-lg:border-t max-lg:border-border max-lg:p-3 max-lg:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/products")}>Cancel</Button>
          <Button type="submit" size="lg" className="flex-1" isLoading={saving}>{product ? "Save changes" : "Create product"}</Button>
        </div>
        <div className="h-16 lg:hidden" aria-hidden="true" />
      </aside>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent title="Delete this product?" description={product ? `“${product.name}” will be removed for good.` : undefined}>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>Keep it</Button>
            <Button type="button" variant="danger" isLoading={deleting} onClick={remove}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
