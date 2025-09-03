CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `folders` (
	`id` text PRIMARY KEY NOT NULL,
	`projectId` text NOT NULL,
	`parentId` text,
	`name` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parentId`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `folders_parent_name_uq` ON `folders` (`projectId`,`parentId`,`name`);--> statement-breakpoint
CREATE INDEX `folders_project_parent_idx` ON `folders` (`projectId`,`parentId`);--> statement-breakpoint
CREATE INDEX `folders_project_idx` ON `folders` (`projectId`);--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`projectId` text NOT NULL,
	`folderId` text,
	`name` text NOT NULL,
	`kind` text NOT NULL,
	`sizeBytes` integer NOT NULL,
	`uploadedAt` text DEFAULT (CURRENT_TIMESTAMP),
	`deletedAt` text,
	FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`folderId`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `files_folder_name_uq` ON `files` (`projectId`,`folderId`,`name`);--> statement-breakpoint
CREATE INDEX `files_project_folder_idx` ON `files` (`projectId`,`folderId`);--> statement-breakpoint
CREATE INDEX `files_project_idx` ON `files` (`projectId`);--> statement-breakpoint
CREATE INDEX `files_deleted_idx` ON `files` (`deletedAt`);