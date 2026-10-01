"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { toggleWishlistAction } from "@/server/actions/wishlist.actions";

export function WishlistButton({
  productId,
  productName,
  wished: initial,
  authenticated,
  className,
}: {
  productId: string;
  productName: string;
  wished: boolean;
  authenticated: boolean;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [wished, setWished] = useState(initial);
  const [pending, setPending] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!authenticated) {
      toast("Sign in to save pieces to your wishlist");
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (pending) return;
    const next = !wished;
    setWished(next); // optimistic
    setPending(true);
    const res = await toggleWishlistAction({ productId });
    setPending(false);
    if (!res.ok) {
      setWished(!next);
      toast.error(res.error);
      return;
    }
    setWished(res.data.wished);
    toast.success(res.data.wished ? `Saved ${productName}` : `Removed ${productName} from wishlist`);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={wished}
      aria-label={wished ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      className={cn(
        "grid h-11 w-11 place-items-center rounded-full bg-surface/90 text-fg shadow-soft backdrop-blur transition-[transform,color] duration-150 hover:text-danger active:scale-90",
        wished && "text-danger",
        className,
      )}
    >
      <Heart
        className={cn("h-5 w-5 transition-transform duration-200 ease-snap", wished && "scale-110 fill-current")}
        aria-hidden="true"
      />
    </button>
  );
}
