PRAGMA foreign_keys=OFF;
--> statement-breakpoint
ALTER TABLE app_preferences ADD COLUMN userId integer;
--> statement-breakpoint
ALTER TABLE collection_preferences ADD COLUMN userId integer;
--> statement-breakpoint
ALTER TABLE recipe_preferences ADD COLUMN userId integer;
--> statement-breakpoint
UPDATE `app_preferences`
SET `userId` = (
	SELECT `id`
	FROM `users`
	WHERE `users`.`appPreferencesId` = `app_preferences`.`id`
);
--> statement-breakpoint
UPDATE `collection_preferences`
SET `userId` = (
	SELECT `id`
	FROM `users`
	WHERE `users`.`collectionPreferencesId` = `collection_preferences`.`id`
);
--> statement-breakpoint
UPDATE `recipe_preferences`
SET `userId` = (
	SELECT `id`
	FROM `users`
	WHERE `users`.`recipePreferencesId` = `recipe_preferences`.`id`
);
--> statement-breakpoint
CREATE TABLE `app_preferences_new` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL UNIQUE,
	`theme` text DEFAULT 'system' NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `app_preferences_new` (`id`, `userId`, `theme`) SELECT `id`, `userId`, `theme` FROM `app_preferences`;
--> statement-breakpoint
DROP TABLE `app_preferences`;
--> statement-breakpoint
ALTER TABLE `app_preferences_new` RENAME TO `app_preferences`;
--> statement-breakpoint
CREATE TABLE `collection_preferences_new` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL UNIQUE,
	`defaultVisibility` text DEFAULT 'public' NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `collection_preferences_new` (
	`id`,
	`userId`,
	`defaultVisibility`
) SELECT `id`, `userId`, `defaultVisibility` FROM `collection_preferences`;
--> statement-breakpoint
DROP TABLE `collection_preferences`;
--> statement-breakpoint
ALTER TABLE `collection_preferences_new` RENAME TO `collection_preferences`;
--> statement-breakpoint
CREATE TABLE `recipe_preferences_new` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL UNIQUE,
	`defaultVisibility` text DEFAULT 'public' NOT NULL,
	`defaultServingSize` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `recipe_preferences_new` (
	`id`,
	`userId`,
	`defaultVisibility`,
	`defaultServingSize`
) SELECT `id`, `userId`, `defaultVisibility`, `defaultServingSize` FROM `recipe_preferences`;
--> statement-breakpoint
DROP TABLE `recipe_preferences`;
--> statement-breakpoint
ALTER TABLE `recipe_preferences_new` RENAME TO `recipe_preferences`;
--> statement-breakpoint
CREATE TABLE `users_new` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`hashedPassword` text NOT NULL,
	`username` text NOT NULL,
	`avatarId` integer,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`avatarId`) REFERENCES `file_references`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `users_new` (
	`id`,
	`publicId`,
	`hashedPassword`,
	`username`,
	`avatarId`,
	`role`,
	`createdAt`,
	`updatedAt`
) SELECT `id`, `publicId`, `hashedPassword`, `username`, `avatarId`, `role`, `createdAt`, `updatedAt` FROM `users`;
--> statement-breakpoint
DROP TABLE `users`;
--> statement-breakpoint
ALTER TABLE `users_new` RENAME TO `users`;
--> statement-breakpoint
PRAGMA foreign_keys=ON;