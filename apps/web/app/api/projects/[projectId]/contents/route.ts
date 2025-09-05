import { NextRequest } from "next/server";
import { db } from "@codex/db";
import { folders } from "@codex/db/schemas/folders.sql";
import { files } from "@codex/db/schemas/files.sql";
import { and, eq, isNull } from "drizzle-orm";
import { json, fail } from "../../../_lib/validate";
import type { Ctx } from "../../../_lib/validate";

/**
 * GET request to load the combined contents of a folder - both files and folders.
 * @param req - The request object.
 * @param ctx - The context object.
 * @returns The contents of the folder.
 */
export async function GET(req: NextRequest, ctx: Ctx<{ projectId: string }>) {
  const { projectId } = await ctx.params;
  try {
    const url = new URL(req.url);
    const folderIdParam = url.searchParams.get("folderId");

    /**
     * Condition that gives us the right folder (or the root folder if no folderId is provided)
     */
    const folderWhere = and(
      eq(folders.projectId, projectId),
      folderIdParam === null ? isNull(folders.parentId) : eq(folders.parentId, folderIdParam)
    );

    /**
     * Condition that gives us the right files (or the root files if no folderId is provided)
     */
    const fileWhere = and(
      eq(files.projectId, projectId),
      folderIdParam === null ? isNull(files.folderId) : eq(files.folderId, folderIdParam),
      isNull(files.deletedAt)
    );


    const [foldersRows, filesRows] = await Promise.all([
      db.select().from(folders).where(folderWhere).orderBy(folders.createdAt),
      db.select().from(files).where(fileWhere).orderBy(files.uploadedAt),
    ]);


    return json({ folders: foldersRows, files: filesRows });
  } catch (err) {
    console.error(err);
    return fail(500, "Failed to load contents");
  }
}