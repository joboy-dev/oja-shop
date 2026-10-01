import { Text } from "@react-email/components";
import { EmailLayout, h1, label, mail, p } from "./components/EmailLayout";

export function ContactNotification({ name, email, subject, message, appUrl }: { name: string; email: string; subject: string; message: string; appUrl: string }) {
  return (
    <EmailLayout appUrl={appUrl} preview={`Message from ${name}: ${subject}`}>
      <Text style={h1}>{subject}</Text>
      <Text style={label}>From</Text>
      <Text style={{ ...p, color: mail.ink }}>
        {name} · <a href={`mailto:${email}`} style={{ color: mail.primary }}>{email}</a>
      </Text>
      <Text style={label}>Message</Text>
      <Text style={{ ...p, color: mail.ink, whiteSpace: "pre-wrap" }}>{message}</Text>
      <Text style={{ ...p, fontSize: 14 }}>Reply to this email to answer {name} directly.</Text>
    </EmailLayout>
  );
}
