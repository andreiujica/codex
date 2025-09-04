import { drizzle } from "drizzle-orm/libsql";
import { createClient, Client } from "@libsql/client";

/**
 * Prevent multiple clients during dev hot-reload. Take the global object (globalThis) 
 * and treat it as if it has two optional properties, __libsql and __db, so we can 
 * safely assign/reuse them without TypeScript complaining.
 */
const globalForDb = globalThis as unknown as {
  __libsql?: Client;
  __db?: ReturnType<typeof drizzle>;
};

const required = (name: string): string => {
  const v = process.env[name];
  if (!v) throw new Error(`❌ Missing env ${name}`);
  return v;
}

/**
 * The DATABASE_URL is required and should be in the form of 
 * libsql://codex-prod-xxx.turso.io or file:///path/to/database.db (for local development)
 * 
 * The DATABASE_AUTH_TOKEN is optional and is used to authenticate 
 * with the database in production.
 */
const client =
  globalForDb.__libsql ??
  createClient({
    url: required("DATABASE_URL"),
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

export const db = globalForDb.__db ?? drizzle(client, { casing: 'snake_case' });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__libsql = client;
  globalForDb.__db = db;
}
