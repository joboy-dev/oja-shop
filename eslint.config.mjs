import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Layer boundaries (see AGENTS.md):
 *   components/ → lib, components, server/actions only
 *   lib/        → lib only
 *   app/        → everything except repositories, db, email, storage
 *   server/actions → services, auth, lib (never repositories/db/email/storage/components)
 *   server/services → repositories, email, storage, lib (never actions/components)
 *   server/repositories → db, lib (never services/actions/email/storage/components)
 */
const boundary = (group, message) => ({
  "no-restricted-imports": ["error", { patterns: [{ group, message }] }],
});

const dataLayer = ["@/server/db", "@/server/db/*", "@/server/repositories/*", "@/server/email/*", "@/server/storage/*"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["components/**/*.{ts,tsx}"],
    rules: boundary(
      ["@/server/services/*", "@/server/auth/*", "@/server/config/*", ...dataLayer],
      "components/ may only import server/actions/*. Fetch data in app/ and pass it as props.",
    ),
  },
  {
    files: ["lib/**/*.{ts,tsx}"],
    rules: boundary(["@/server/*", "@/components/*"], "lib/ is client-safe and must not import from server/ or components/."),
  },
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: boundary(dataLayer, "app/ reads through server/services/* and mutates through server/actions/*."),
  },
  {
    files: ["server/actions/**/*.ts"],
    rules: boundary(
      ["@/components/*", ...dataLayer],
      "actions call services only: requireUser → validate → service → revalidate.",
    ),
  },
  {
    files: ["server/services/**/*.ts"],
    rules: boundary(["@/components/*", "@/server/actions/*"], "services must not import UI or actions."),
  },
  {
    files: ["server/repositories/**/*.ts"],
    rules: boundary(
      ["@/components/*", "@/server/actions/*", "@/server/services/*", "@/server/email/*", "@/server/storage/*"],
      "repositories only run queries via server/db.",
    ),
  },
  globalIgnores([".claude/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "server/db/migrations/**"]),
]);

export default eslintConfig;
