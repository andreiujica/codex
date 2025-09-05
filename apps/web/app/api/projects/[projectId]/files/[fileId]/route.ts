import { NextRequest } from "next/server";
import { db } from "@codex/db";
import { files } from "@codex/db/schemas/files.sql";
import { folders } from "@codex/db/schemas/folders.sql";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { validateRequestBody, json, fail } from "../../../../_lib/validate";
import { HttpError } from "../../../../_lib/http";
import type { Ctx } from "../../../../_lib/validate";


function scopeFile(projectId: string, fileId: string) {
  return and(eq(files.id, fileId), eq(files.projectId, projectId));
}

/**
 * GET request to get a file by its ID.
 * @param _req - The request object.
 * @param ctx - The context object.
 * @returns The file.
 */
export async function GET(_req: NextRequest, ctx: Ctx<{ projectId: string; fileId: string }>) {
  const { projectId, fileId } = await ctx.params;
  try {
    const [row] = await db.select().from(files).where(scopeFile(projectId, fileId));
    if (!row) throw new HttpError(404, "File not found");
    return json(row);
  } catch (err) {
    console.error(err);
    if (err instanceof HttpError) return fail(err.status, err.message, err.details);
    return fail(500, "Failed to get file");
  }
}


/**
 * Zod schema for the request body of the PATCH request.
 */
const UpdateFile = z.object({
  name: z.string().min(1).max(255).optional(),
  folderId: z.string().nullable().optional(),
  softDelete: z.boolean().optional(),
  restore: z.boolean().optional(),
});


/**
 * PATCH request to update a file. Can also be used for soft-deleting or restoring a file.
 * @param req - The request object.
 * @param ctx - The context object.
 * @returns The updated file.
 */
export async function PATCH(req: NextRequest, ctx: Ctx<{ projectId: string; fileId: string }>) {
  const { projectId, fileId } = await ctx.params;
  try {
    const body = await validateRequestBody(req, UpdateFile);


    if (body.folderId) {
      const [f] = await db.select({ id: folders.id, projectId: folders.projectId }).from(folders).where(eq(folders.id, body.folderId));
      if (!f || f.projectId !== projectId) throw new HttpError(400, "Folder not in project");
    }


    const updates: Record<string, any> = {};
    if (body.name) updates.name = body.name;
    if (body.folderId !== undefined) updates.folderId = body.folderId;
    if (body.softDelete) updates.deletedAt = new Date().toISOString();
    if (body.restore) updates.deletedAt = null;


    const [row] = await db.update(files).set(updates).where(scopeFile(projectId, fileId)).returning();
    if (!row) throw new HttpError(404, "File not found");
    return json(row);
  } catch (err: any) {
    console.error(err);
    if (err instanceof HttpError) return fail(err.status, err.message, err.details);
    if (String(err?.message || "").includes("files_folder_name_uq")) {
      return fail(409, "A file with this name already exists in that folder");
    }
    return fail(500, "Failed to update file");
  }
}


/**
 * DELETE request to delete a file. Can also be used for hard-deleting a file.
 * @param req - The request object.
 * @param ctx - The context object.
 * @returns The deleted file.
 */
export async function DELETE(req: NextRequest, ctx: Ctx<{ projectId: string; fileId: string }>) {
  const { projectId, fileId } = await ctx.params;
  try {
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "true";


    if (force) {
      await db.delete(files).where(scopeFile(projectId, fileId));
      return json({ ok: true });
    }

    const [row] = await db.delete(files).where(scopeFile(projectId, fileId)).returning();
    if (!row) throw new HttpError(404, "File not found");
    return json(row);
  } catch (err) {
    console.error(err);
    return fail(500, "Failed to delete file");
  }
}