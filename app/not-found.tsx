import Link from "next/link";
import { AdirePattern } from "@/components/brand/AdirePattern";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-5 py-16 text-center">
      <AdirePattern className="absolute inset-0 -z-10 text-primary opacity-[0.06]" />
      <div className="max-w-md">
        <Logo className="mb-10" />
        <p className="font-mono text-sm tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-3">We couldn&apos;t find that page</h1>
        <p className="mt-4 text-lg text-fg-muted">The link may be old, or the piece may have sold out and moved on.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><Link href="/shop">Browse the shop</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/">Go home</Link></Button>
        </div>
      </div>
    </main>
  );
}
