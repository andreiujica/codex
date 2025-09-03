import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { projects } from "./projects.sql";
import { folders } from "./folders.sql";
import { createId } from "@paralleldrive/cuid2";

/**
 * We only want to support a limited set of file kinds.
 * Namely, PDF, Word, Excel, PowerPoint.
 */
export const fileKinds = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"] as const;
export type FileKind = typeof fileKinds[number];

/**
 * A file is a document that can be stored in a folder.
 */
export const files = sqliteTable(
  "files",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    projectId: text().notNull().references(() => projects.id, { onDelete: "cascade" }),

    /**
     * A null folderId means the file is in the project root.
     */
    folderId: text().references(() => folders.id, { onDelete: "cascade" }),
    name: text().notNull(),
    kind: text().notNull(),
    sizeBytes: integer().notNull(),
    uploadedAt: text().default(sql`(CURRENT_TIMESTAMP)`),

    /**
     * Soft-delete; NOTE: uniqueness below doesn't exclude deleted rows
     */
    deletedAt: text(),
  },
  (t) => ([
    /**
     * Enforce unique name within a folder (root = folderId NULL)
     * Also, index on the projectId and folderId to improve query performance.
     */
    uniqueIndex("files_folder_name_uq").on(t.projectId, t.folderId, t.name),
    index("files_project_folder_idx").on(t.projectId, t.folderId),
    index("files_project_idx").on(t.projectId),
    index("files_deleted_idx").on(t.deletedAt),
  ])
);
