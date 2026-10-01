"use client";

import { Check, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ContactMessageDTO } from "@/lib/types/admin";
import { formatDateTime } from "@/lib/utils/date";
import { markMessageReadAction } from "@/server/actions/admin/message.actions";

export function MessageList({ messages }: { messages: ContactMessageDTO[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function read(id: string) {
    setBusy(id);
    const res = await markMessageReadAction({ id });
    setBusy(null);
    if (!res.ok) return toast.error(res.error);
    router.refresh();
  }

  return (
    <ul className="space-y-4">
      {messages.map((m) => (
        <li key={m.id} className="rounded-card border border-border bg-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-display text-lg font-semibold">
                {m.subject} {m.status === "new" && <Badge tone="accent">New</Badge>}
              </p>
              <p className="mt-0.5 text-sm text-fg-muted">
                {m.name} · <a href={`mailto:${m.email}`} className="text-primary hover:underline">{m.email}</a> · {formatDateTime(m.createdAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline" startIcon={<Mail className="h-3.5 w-3.5" />}>
                <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}>Reply</a>
              </Button>
              {m.status === "new" && (
                <Button size="sm" variant="secondary" isLoading={busy === m.id} onClick={() => read(m.id)} startIcon={<Check className="h-3.5 w-3.5" />}>Mark read</Button>
              )}
            </div>
          </div>
          <p className="mt-4 whitespace-pre-line text-[0.9375rem] text-fg-muted">{m.message}</p>
        </li>
      ))}
    </ul>
  );
}
