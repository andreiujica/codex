import { NextRequest } from "next/server";
import { db } from "@codex/db";
import { folders } from "@codex/db/schemas/folders.sql";
import { projects } from "@codex/db/schemas/projects.sql";
import { and, eq, isNull} from "drizzle-orm";
import { z } from "zod";
import { validateRequestBody, json, fail } from "../../../_lib/validate";
import { HttpError } from "../../../_lib/http";
import type { Ctx } from "../../../_lib/validate";


/**
 * GET request to list folders.
 * @param req - The request object.
 * @param projectId - The project ID, comes from the URL
 * @param parentId - The parent folder ID, comes from the query string (ex. ?parentId=123)
 * @returns 
 */
export async function GET(req: NextRequest, ctx: Ctx<{ projectId: string }>) {
  try {
    const { projectId } = await ctx.params;
    const url = new URL(req.url);
    const parentIdParam = url.searchParams.get("parentId");

    /**
     * Explicit null = root folder in this case.
     */
    const parentId = parentIdParam === null ? null : parentIdParam; 


    const where = and(
      eq(folders.projectId, projectId),
      parentId === null ? isNull(folders.parentId) : eq(folders.parentId, parentId)
    );


    const rows = await db.select().from(folders).where(where).orderBy(folders.createdAt);
    return json(rows);
  } catch (err) {
    console.error(err);
    if (err instanceof HttpError) return fail(err.status, err.message, err.details);
    return fail(500, "Failed to list folders");
  }
}


/**
 * The schema for the request body of the POST request.
 */

const CreateFolder = z.object({
  name: z.string().min(1).max(255),
  parentId: z.string().nullable().optional(),
});

/**
 * POST request to create a folder.
 * @param req - Should be validated using CreateFolder schema.
 * @param ctx - The context object.
 * @returns The created folder.
 */
export async function POST(req: NextRequest, ctx: Ctx<{ projectId: string }>) {
  try {
    const { projectId } = await ctx.params;
    const body = await validateRequestBody(req, CreateFolder);


    /**
     * Ensure project exists.
     */
    const [proj] = await db.select({ id: projects.id }).from(projects).where(eq(projects.id, projectId));
    if (!proj) throw new HttpError(404, "Project not found");


    /**
     * If parentId provided, ensure it belongs to same project.
     */
    if (body.parentId) {
      const [p] = await db.select({ id: folders.id, projectId: folders.projectId }).from(folders).where(eq(folders.id, body.parentId));
      if (!p || p.projectId !== projectId) throw new HttpError(400, "Parent folder not in project");
    }


    const [row] = await db.insert(folders).values({
      name: body.name,
      projectId: projectId,
      parentId: body.parentId ?? null,
    }).returning();


    return json(row, { status: 201 });
  } catch (err: any) {
    console.error(err);
    if (err instanceof HttpError) return fail(err.status, err.message, err.details);
    /**
     * Unique name within same parent.
     */
    if (String(err?.message || "").includes("folders_parent_name_uq")) {
      return fail(409, "A folder with this name already exists in that location");
    }
    return fail(500, "Failed to create folder");
  }
}