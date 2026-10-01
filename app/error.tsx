"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[70dvh] place-items-center px-5 py-16 text-center">
      <div className="max-w-md">
        <h1>Something went wrong</h1>
        <p className="mt-4 text-lg text-fg-muted">That page hit a problem. It&apos;s us, not you. Try again, and if it keeps happening let us know.</p>
        {error.digest && <p className="mt-3 font-mono text-xs text-fg-muted">Reference: {error.digest}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={reset}>Try again</Button>
          <Button size="lg" variant="outline" onClick={() => (window.location.href = "/")}>Go home</Button>
        </div>
      </div>
    </main>
  );
}
