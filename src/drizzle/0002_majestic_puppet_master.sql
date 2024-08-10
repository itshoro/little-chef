ALTER TABLE `collections` RENAME TO `collections_old`;
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`isCustom` integer,
	`visibility` text NOT NULL,
	`itemCount` integer DEFAULT 0 NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `collections` SELECT * FROM `collections_old`;
--> statement-breakpoint
DROP TABLE `collections_old`;