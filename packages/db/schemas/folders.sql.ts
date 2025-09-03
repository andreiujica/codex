import { sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { projects } from "./projects.sql";
import { createId } from "@paralleldrive/cuid2";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";

/**
 * A folder is a collection of files. It can be nested inside other folders.
 * It can also be present at the root of a project.
 */
export const folders = sqliteTable(
  "folders",
  {
    id: text().primaryKey().$defaultFn(() => createId()),
    projectId: text().notNull().references(() => projects.id, { onDelete: "cascade" }),

    /**
     * A null parentId means the folder is in the project root.
     */
    parentId: text().references((): AnySQLiteColumn => folders.id, { onDelete: "cascade" }),
    name: text().notNull(),
    createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => ([
    /**
     * We add indeces to improve query performance at the expense of write performance.
     */
    uniqueIndex("folders_parent_name_uq").on(t.projectId, t.parentId, t.name),
    index("folders_project_parent_idx").on(t.projectId, t.parentId),
    index("folders_project_idx").on(t.projectId),
  ])
);
