/**
 * Deletes uploads that were never attached to anything (admin uploaded a photo, then closed the form).
 *
 *   npm run storage:cleanup                 delete pending uploads older than 24 hours
 *   npm run storage:cleanup -- --hours=1    use a different age
 *   npm run storage:cleanup -- --dry-run    list what would be deleted
 *
 * Safe to run any time and on a schedule (Vercel Cron, a GitHub Action, or by hand).
 */
import { deleteUploadsByKeys, listStalePending } from "@/server/repositories/upload.repo";
import { deleteObject } from "@/server/storage/object-storage";

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const hours = Number(args.find((a) => a.startsWith("--hours="))?.split("=")[1] ?? 24);
  if (!Number.isFinite(hours) || hours < 0) throw new Error("--hours must be a number of hours, 0 or more");

  const cutoff = new Date(Date.now() - hours * 3_600_000);
  const stale = await listStalePending(cutoff);
  console.log(`${stale.length} pending upload(s) older than ${hours}h${dryRun ? " (dry run)" : ""}`);

  const removed: string[] = [];
  for (const row of stale) {
    console.log(`  ${row.storageKey}  created ${row.createdAt.toISOString()}`);
    if (dryRun) continue;
    try {
      await deleteObject(row.storageKey); // S3 delete is idempotent: fine if the file never arrived
      removed.push(row.storageKey);
    } catch (err) {
      console.error(`  could not delete ${row.storageKey}:`, (err as Error).message);
    }
  }
  if (!dryRun) {
    await deleteUploadsByKeys(removed);
    console.log(`Deleted ${removed.length} upload(s).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
