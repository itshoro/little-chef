CREATE TABLE `temporaryAssets` (
	`id` integer PRIMARY KEY NOT NULL,
	`url` text
);
--> statement-breakpoint
ALTER TABLE `recipes` ADD `coverUrl` text;