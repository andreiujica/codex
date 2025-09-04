ALTER TABLE `projects` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `folders` RENAME COLUMN "projectId" TO "project_id";--> statement-breakpoint
ALTER TABLE `folders` RENAME COLUMN "parentId" TO "parent_id";--> statement-breakpoint
ALTER TABLE `folders` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `files` RENAME COLUMN "projectId" TO "project_id";--> statement-breakpoint
ALTER TABLE `files` RENAME COLUMN "folderId" TO "folder_id";--> statement-breakpoint
ALTER TABLE `files` RENAME COLUMN "sizeBytes" TO "size_bytes";--> statement-breakpoint
ALTER TABLE `files` RENAME COLUMN "uploadedAt" TO "uploaded_at";--> statement-breakpoint
ALTER TABLE `files` RENAME COLUMN "deletedAt" TO "deleted_at";--> statement-breakpoint
DROP INDEX `folders_parent_name_uq`;--> statement-breakpoint
DROP INDEX `folders_project_parent_idx`;--> statement-breakpoint
DROP INDEX `folders_project_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `folders_parent_name_uq` ON `folders` (`project_id`,`parent_id`,`name`);--> statement-breakpoint
CREATE INDEX `folders_project_parent_idx` ON `folders` (`project_id`,`parent_id`);--> statement-breakpoint
CREATE INDEX `folders_project_idx` ON `folders` (`project_id`);--> statement-breakpoint
ALTER TABLE `folders` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `folders` ALTER COLUMN "parent_id" TO "parent_id" text REFERENCES folders(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
DROP INDEX `files_folder_name_uq`;--> statement-breakpoint
DROP INDEX `files_project_folder_idx`;--> statement-breakpoint
DROP INDEX `files_project_idx`;--> statement-breakpoint
DROP INDEX `files_deleted_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `files_folder_name_uq` ON `files` (`project_id`,`folder_id`,`name`);--> statement-breakpoint
CREATE INDEX `files_project_folder_idx` ON `files` (`project_id`,`folder_id`);--> statement-breakpoint
CREATE INDEX `files_project_idx` ON `files` (`project_id`);--> statement-breakpoint
CREATE INDEX `files_deleted_idx` ON `files` (`deleted_at`);--> statement-breakpoint
ALTER TABLE `files` ALTER COLUMN "project_id" TO "project_id" text NOT NULL REFERENCES projects(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `files` ALTER COLUMN "folder_id" TO "folder_id" text REFERENCES folders(id) ON DELETE cascade ON UPDATE no action;