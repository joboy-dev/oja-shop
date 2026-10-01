"use client";

import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button, IconButton } from "@/components/ui/Button";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { Switch } from "@/components/ui/Switch";
import { deleteProductAction, setProductActiveAction } from "@/server/actions/admin/product.actions";

export function VisibilitySwitch({ id, name, isActive }: { id: string; name: string; isActive: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState(isActive);
  const [pending, setPending] = useState(false);

  async function toggle(next: boolean) {
    setActive(next); // optimistic
    setPending(true);
    const res = await setProductActiveAction({ id, isActive: next });
    setPending(false);
    if (!res.ok) {
      setActive(!next);
      return toast.error(res.error);
    }
    toast.success(next ? `${name} is now visible` : `${name} is now hidden`);
    router.refresh();
  }

  return <Switch label={active ? "Visible" : "Hidden"} checked={active} disabled={pending} onCheckedChange={toggle} />;
}

export function ProductRowMenu({ id, slug, name, isActive }: { id: string; slug: string; name: string; isActive: boolean }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    setDeleting(true);
    const res = await deleteProductAction({ id });
    setDeleting(false);
    setConfirm(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(`Deleted ${name}`);
    router.refresh();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton label={`Actions for ${name}`}><MoreHorizontal className="h-5 w-5" aria-hidden="true" /></IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild><Link href={`/admin/products/${id}`}><Pencil className="h-4 w-4" aria-hidden="true" />Edit</Link></DropdownMenuItem>
          {isActive && <DropdownMenuItem asChild><Link href={`/products/${slug}`} target="_blank"><ExternalLink className="h-4 w-4" aria-hidden="true" />View in shop</Link></DropdownMenuItem>}
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={() => setConfirm(true)}><Trash2 className="h-4 w-4" aria-hidden="true" />Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent title="Delete this product?" description={`“${name}” will be removed for good.`}>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setConfirm(false)}>Keep it</Button>
            <Button variant="danger" isLoading={deleting} onClick={remove}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
