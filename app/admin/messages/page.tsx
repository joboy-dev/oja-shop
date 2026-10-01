import { Inbox } from "lucide-react";
import type { Metadata } from "next";
import { MessageList } from "@/components/admin/MessageList";
import { PageTitle } from "@/components/admin/PageTitle";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireAdmin } from "@/server/auth/session";
import { listMessages } from "@/server/services/admin-misc.service";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessages() {
  await requireAdmin("/admin/messages");
  const messages = await listMessages();
  const unread = messages.filter((m) => m.status === "new").length;
  return (
    <>
      <PageTitle title="Messages" description={unread > 0 ? `${unread} unread` : "All caught up"} />
      {messages.length === 0 ? (
        <EmptyState icon={Inbox} title="No messages yet" description="Messages from the contact form land here." />
      ) : (
        <div className="max-w-3xl"><MessageList messages={messages} /></div>
      )}
    </>
  );
}
