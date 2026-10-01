"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { signIn } from "@/lib/auth/client";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.27-2.09 3.57-5.17 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.87-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.27a12 12 0 0 0 0 10.74l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.63l4 3.1C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  );
}

export function GoogleSignInButton({ next = "/", label = "Continue with Google" }: { next?: string; label?: string }) {
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: next,
      errorCallbackURL: `/login?error=oauth&next=${encodeURIComponent(next)}`,
    });
    // On success the browser is already navigating to Google; only a failure lands here.
    if (error) {
      setPending(false);
      window.location.assign(`/login?error=oauth&next=${encodeURIComponent(next)}`);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full bg-surface"
      isLoading={pending}
      onClick={onClick}
      startIcon={<GoogleMark />}
    >
      {label}
    </Button>
  );
}
