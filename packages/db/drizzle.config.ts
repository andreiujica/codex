import dotenv from 'dotenv'
import path from 'path'
import { defineConfig } from "drizzle-kit";

/**
 * NOTE: We will manually run migrations for now, so we can just use the development env file.
 * 
 * In the future, we will need to check whether we are running this in a CI or local development.
 */
dotenv.config({ path: path.resolve(__dirname, '../../env/.env.development') });

/**
 * We use a single driver: "turso" (aka libsql).
 * Works with:
 *  - local:  DATABASE_URL=file:./sqlite/dev.db
 *  - prod:   DATABASE_URL=libsql://<your-db>.turso.io  (+ DATABASE_AUTH_TOKEN for your app runtime)
 */
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("❌ Missing env DATABASE_URL (e.g. file:./sqlite/dev.db or libsql://...turso.io)");
}

export default defineConfig({
  schema: [
    "./schemas/projects.sql.ts",
    "./schemas/folders.sql.ts",
    "./schemas/files.sql.ts",
  ],
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: { url, authToken: process.env.DATABASE_AUTH_TOKEN },
  strict: true,
  verbose: true,
});
