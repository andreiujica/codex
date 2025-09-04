import { NextRequest } from "next/server";
import { db } from "@codex/db";
import { projects } from "@codex/db/schemas/projects.sql";
import { desc } from "drizzle-orm";
import { json, fail } from "../_lib/validate";
import { HttpError } from "../_lib/http";

/**
 * GET request to list all projects.
 * @param _req - The request object.
 * @returns The list of projects.
 */
export async function GET(_req: NextRequest) {
  try {
    const rows = await db.select().from(projects).orderBy(desc(projects.createdAt));
    return json(rows);
  } catch (err) {
    console.error(err);
    if (err instanceof HttpError) return fail(err.status, err.message, err.details);
    return fail(500, "Failed to list projects");
  }
}