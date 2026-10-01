"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { subscribeNewsletterAction } from "@/server/actions/contact.actions";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<null | "new" | "existing">(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Light client check only (keeps zod out of every page's bundle); the server validates for real.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError("Enter a valid email address");
    setError(undefined);
    setPending(true);
    const res = await subscribeNewsletterAction({ email: email.trim() });
    setPending(false);
    if (!res.ok) return setError(res.error);
    setDone(res.data.alreadySubscribed ? "existing" : "new");
  }

  if (done) {
    return (
      <p role="status" className="flex items-center gap-2 text-[0.9375rem] font-medium text-success">
        <Check className="h-5 w-5" aria-hidden="true" />
        {done === "new" ? "You're on the list. We'll write when new pieces land." : "You're already on the list."}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-sm">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <Input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          invalid={!!error}
          aria-describedby={error ? "newsletter-error" : undefined}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" isLoading={pending} className="shrink-0">
          Subscribe
        </Button>
      </div>
      {error && (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
