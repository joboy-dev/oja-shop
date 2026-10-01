import "server-only";
import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleWs } from "drizzle-orm/neon-serverless";
import type { PgDatabase } from "drizzle-orm/pg-core";
import ws from "ws";
import { env } from "@/server/config/env";
import * as schema from "./schema";

/** Anything that can run queries: the shared `db` or a transaction handle. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DbExecutor = PgDatabase<any, typeof schema>;

/** Stateless HTTP driver: fast for single queries, but cannot run transactions. */
export const db: DbExecutor = drizzleHttp(neon(env.DATABASE_URL), { schema });

/**
 * Run `fn` inside one real Postgres transaction (needs the WebSocket driver).
 * A short-lived pool is opened per call and always closed, so it is safe on serverless.
 */
export async function withTransaction<T>(fn: (tx: DbExecutor) => Promise<T>): Promise<T> {
  if (typeof WebSocket === "undefined") neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  try {
    const wsDb = drizzleWs(pool, { schema });
    return await wsDb.transaction(async (tx) => fn(tx as unknown as DbExecutor));
  } finally {
    await pool.end();
  }
}

export { schema };
