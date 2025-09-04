import { NextRequest } from "next/server";
import { db } from "@codex/db";
import { folders } from "@codex/db/schemas/folders.sql";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { validateRequestBody, json, fail } from "../../../../_lib/validate";
import { HttpError } from "../../../../_lib/http";
import type { Ctx } from "../../../../_lib/validate";


/**
 * Helper function that scopes the folder by projectId and folderId.
 * @param projectId - The project ID.
 * @param folderId - The folder ID.
 * @returns A Drizzle ORM clause to scope the folder by projectId and folderId.
 */
function scopeFolder(projectId: string, folderId: string) {
  return and(eq(folders.id, folderId), eq(folders.projectId, projectId));
}

/**
 * GET request to get a folder.
 * @param _req - The request object.
 * @param ctx - The context object.
 * @returns The folder.
 */
export async function GET(_req: NextRequest, ctx: Ctx<{ projectId: string; folderId: string }>) {
  const { projectId, folderId } = await ctx.params;
  try {
    const [row] = await db.select().from(folders).where(scopeFolder(projectId, folderId));
    if (!row) throw new HttpError(404, "Folder not found");
    return json(row);
  } catch (err) {
    console.error(err);
    if (err instanceof HttpError) return fail(err.status, err.message, err.details);
    return fail(500, "Failed to get folder");
  }
}


/**
 * Zod schema for the request body of the PATCH request.
 */
const UpdateFolder = z.object({
  name: z.string().min(1).max(255).optional(),
  parentId: z.string().nullable().optional(),
});

/**
 * PATCH request to update a folder. Can also be used for soft-deleting a folder.
 * @param req - The request object.
 * @param ctx - The context object.
 * @returns The updated folder.
 */
export async function PATCH(req: NextRequest, ctx: Ctx<{ projectId: string; folderId: string }>) {
  const { projectId, folderId } = await ctx.params;
  try {
    const body = await validateRequestBody(req, UpdateFolder);


    if (body.parentId) {
      /**
       * Ensure new parent is in same project.
       */
      const [p] = await db.select({ id: folders.id, projectId: folders.projectId }).from(folders).where(eq(folders.id, body.parentId));
      if (!p || p.projectId !== projectId) throw new HttpError(400, "Parent folder not in project");
    }


    const [row] = await db.update(folders).set({
      ...(body.name ? { name: body.name } : {}),
      ...(body.parentId !== undefined ? { parentId: body.parentId } : {}),
    }).where(scopeFolder(projectId, folderId)).returning();


    if (!row) throw new HttpError(404, "Folder not found");
    return json(row);
  } catch (err: any) {
    console.error(err);
    if (err instanceof HttpError) return fail(err.status, err.message, err.details);

    if (String(err?.message || "").includes("folders_parent_name_uq")) {
      return fail(409, "A folder with this name already exists in that location");
    }
    return fail(500, "Failed to update folder");
  }
}


/**
 * DELETE request to delete a folder. This is a HARD delete.
 * @param _req - The request object.
 * @param ctx - The context object.
 * @returns The deleted folder.
 */
export async function DELETE(_req: NextRequest, ctx: Ctx<{ projectId: string; folderId: string }>) {
  const { projectId, folderId } = await ctx.params;
  try {
    await db.delete(folders).where(scopeFolder(projectId, folderId));
    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return fail(500, "Failed to delete folder");
  }
}