CREATE TABLE `collections_TMP` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`isCustom` integer,
	`visibility` text NOT NULL,
	`itemCount` integer DEFAULT 0 NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `collections_TMP` SELECT * FROM `collections`;
--> statement-breakpoint
DROP TABLE `collections`;
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
INSERT INTO `collections` SELECT * FROM `collections_TMP`;
--> statement-breakpoint
DROP TABLE `collections_TMP`;