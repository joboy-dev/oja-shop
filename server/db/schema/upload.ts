import { index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { createdAt } from "./_shared";

export const uploadStatus = pgEnum("upload_status", ["pending", "attached"]);
export const uploadPurpose = pgEnum("upload_purpose", ["product", "category"]);

/** Ledger of every object we put in the bucket, so abandoned uploads can be cleaned up. */
export const uploads = pgTable(
  "uploads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storageKey: text("storage_key").notNull().unique(),
    contentType: text("content_type").notNull(),
    sizeBytes: integer("size_bytes"),
    purpose: uploadPurpose("purpose").notNull(),
    status: uploadStatus("status").notNull().default("pending"),
    uploadedBy: text("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: createdAt(),
    attachedAt: timestamp("attached_at", { withTimezone: true }),
  },
  (t) => [index("uploads_status_created_idx").on(t.status, t.createdAt)],
);
