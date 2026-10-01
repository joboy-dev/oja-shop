import "server-only";
import { z } from "zod";

const emailList = z
  .string()
  .default("")
  .transform((v) =>
    v
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );

const schema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),

  DATABASE_URL: z.string().min(1),
  DATABASE_URL_UNPOOLED: z.string().min(1),

  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  ADMIN_EMAILS: emailList,

  MAILGUN_API_KEY: z.string().min(1),
  MAILGUN_DOMAIN: z.string().min(1),
  MAILGUN_API_BASE_URL: z.url().default("https://api.mailgun.net"),
  MAIL_FROM: z.string().min(3),
  SHOP_NOTIFICATIONS_EMAIL: z.email(),

  /** Optional: shown to customers who choose bank transfer. */
  BANK_NAME: z.string().optional(),
  BANK_ACCOUNT_NAME: z.string().optional(),
  BANK_ACCOUNT_NUMBER: z.string().optional(),

  AWS_ENDPOINT_URL_S3: z.url(),
  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  STORAGE_BUCKET: z.string().min(1),
  /** Host of the public_read bucket, WITHOUT bucket name or trailing slash. */
  STORAGE_PUBLIC_URL: z.url().transform((v) => v.replace(/\/+$/, "")),
});

function load() {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    throw new Error(`Invalid environment variables (see .env.example):\n${lines.join("\n")}`);
  }
  return parsed.data;
}

export const env = load();
