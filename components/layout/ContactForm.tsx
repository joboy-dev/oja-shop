"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useZodForm } from "@/lib/hooks/useZodForm";
import { contactSchema } from "@/lib/validators/contact";
import { submitContactAction } from "@/server/actions/contact.actions";

export function ContactForm({ defaults }: { defaults?: { name?: string; email?: string } }) {
  const form = useZodForm(contactSchema, { name: defaults?.name ?? "", email: defaults?.email ?? "", subject: "", message: "" });
  const { register, handleSubmit, formState, setError } = form;
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string>();

  const onSubmit = handleSubmit(async (values) => {
    setServerError(undefined);
    const res = await submitContactAction(values);
    if (!res.ok) {
      setServerError(res.error);
      for (const [field, messages] of Object.entries(res.fieldErrors ?? {})) setError(field as never, { message: messages[0] });
      return;
    }
    setSent(true);
  });

  if (sent) {
    return (
      <div role="status" className="rounded-sheet border border-success/30 bg-success-soft p-8 text-center">
        <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-success text-white">
          <Check className="h-6 w-6" strokeWidth={3} aria-hidden="true" />
        </span>
        <h2 className="text-2xl">Message sent</h2>
        <p className="mx-auto mt-2 max-w-sm text-fg-muted">Thanks for writing. We reply within one working day, usually sooner.</p>
      </div>
    );
  }

  const e = formState.errors;
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={e.name?.message} required>
          <Input autoComplete="name" {...register("name")} />
        </Field>
        <Field label="Email" error={e.email?.message} required>
          <Input type="email" autoComplete="email" {...register("email")} />
        </Field>
      </div>
      <Field label="Subject" error={e.subject?.message} required>
        <Input placeholder="Order OJ-XXXXXX, a question about a piece…" {...register("subject")} />
      </Field>
      <Field label="Message" error={e.message?.message} required>
        <Textarea rows={6} {...register("message")} />
      </Field>
      {serverError && <p role="alert" className="rounded-control bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{serverError}</p>}
      <Button type="submit" size="lg" isLoading={formState.isSubmitting}>Send message</Button>
    </form>
  );
}
