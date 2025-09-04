import { NextRequest } from "next/server";
import { db } from "@codex/db";
import { files, fileKinds } from "@codex/db/schemas/files.sql";
import { folders } from "@codex/db/schemas/folders.sql";
import { and, eq, isNull, SQL } from "drizzle-orm";
import { z } from "zod";
import { validateRequestBody, json, fail } from "../../../_lib/validate";
import { HttpError } from "../../../_lib/http";
import type { Ctx } from "../../../_lib/validate";


/**
 * GET request to list files.
 * @param req - The request object.
 * @param ctx - The context object.
 * @returns The list of files.
 */
export async function GET(req: NextRequest, ctx: Ctx<{ projectId: string }>) {
  const { projectId } = await ctx.params;
  try {
    const url = new URL(req.url);
    const includeDeleted = url.searchParams.get("includeDeleted") === "true";


    const conditions: SQL<unknown>[] = [
      eq(files.projectId, projectId),
    ];
    
    if (!includeDeleted) {
      conditions.push(isNull(files.deletedAt));
    }


    const rows = await db.select().from(files).where(and(...conditions)).orderBy(files.uploadedAt);
    return json(rows);
  } catch (err) {
    console.error(err);
    return fail(500, "Failed to list files");
  }
}

/**
 * Zod schema for the request body of the POST request.
 */
const CreateFile = z.object({
  name: z.string().min(1).max(255),
  kind: z.enum(fileKinds as unknown as [string, ...string[]]),
  sizeBytes: z.number().int().nonnegative(),
  folderId: z.string().nullable().optional(),
});

/**
 * POST request to create a file.
 * @param req - The request object.
 * @param ctx - The context object.
 * @returns The created file.
 */
export async function POST(req: NextRequest, ctx: Ctx<{ projectId: string }>) {
  const { projectId } = await ctx.params;
  try {
    const body = await validateRequestBody(req, CreateFile);


    if (body.folderId) {
      const [f] = await db.select({ id: folders.id, projectId: folders.projectId }).from(folders).where(eq(folders.id, body.folderId));
      if (!f || f.projectId !== projectId) throw new HttpError(400, "Folder not in project");
    }


    const [row] = await db.insert(files).values({
      name: body.name,
      kind: body.kind,
      sizeBytes: body.sizeBytes,
      folderId: body.folderId ?? null,
      projectId: projectId,
    }).returning();
    return json(row, { status: 201 });
  } catch (err: any) {
    console.error(err);
    if (err instanceof HttpError) return fail(err.status, err.message, err.details);
    if (String(err?.message || "").includes("files_folder_name_uq")) {
      return fail(409, "A file with this name already exists in that folder");
    }
    return fail(500, "Failed to create file");
  }
}