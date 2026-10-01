import "server-only";
import { env } from "@/server/config/env";

export class MailgunError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "MailgunError";
  }
}

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  tags?: string[];
  replyTo?: string;
}

/** Send one message through Mailgun's HTTP API. Resolves with Mailgun's message id; throws MailgunError otherwise. */
export async function sendMail(message: MailMessage): Promise<{ id: string }> {
  const form = new FormData();
  form.set("from", env.MAIL_FROM);
  form.set("to", message.to);
  form.set("subject", message.subject);
  form.set("html", message.html);
  form.set("text", message.text);
  for (const tag of message.tags ?? []) form.append("o:tag", tag);
  if (message.replyTo) form.set("h:Reply-To", message.replyTo);

  let res: Response;
  try {
    res = await fetch(`${env.MAILGUN_API_BASE_URL.replace(/\/$/, "")}/v3/${env.MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`api:${env.MAILGUN_API_KEY}`).toString("base64")}` },
      body: form,
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    throw new MailgunError(`Could not reach Mailgun: ${(err as Error).message}`);
  }

  const raw = await res.text();
  let body: { id?: string; message?: string } = {};
  try {
    body = JSON.parse(raw);
  } catch {
    /* non-JSON error body: fall back to the raw text below */
  }
  if (!res.ok) {
    const detail = body.message ?? (raw.trim().slice(0, 200) || "no details");
    const hint =
      res.status === 401 || res.status === 403
        ? " (On a Mailgun sandbox domain, add the recipient under Authorized Recipients, or verify a real sending domain.)"
        : "";
    throw new MailgunError(`Mailgun ${res.status}: ${detail}${hint}`, res.status);
  }
  return { id: body.id ?? "" };
}
