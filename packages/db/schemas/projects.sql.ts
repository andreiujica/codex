import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';

/**
 * A project represents a collection of files and folders.
 * 
 * Users use this for organization purposes mainly.
 */
export const projects = sqliteTable("projects", {
  id: text().primaryKey().$defaultFn(() => createId()),
  name: text().notNull(),
  description: text().notNull(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});
