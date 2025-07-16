ALTER TABLE `appPreferences` RENAME TO `app_preferences`;--> statement-breakpoint
ALTER TABLE `collectionPreferences` RENAME TO `collection_preferences`;--> statement-breakpoint
ALTER TABLE `collectionRecipes` RENAME TO `collection_recipes`;--> statement-breakpoint
ALTER TABLE `recipePreferences` RENAME TO `recipe_preferences`;--> statement-breakpoint
CREATE TABLE `collection_likes` (
	`collectionId` integer NOT NULL,
	`userId` integer NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `collection_user_permissions` (
	`collectionId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp) NOT NULL,
	PRIMARY KEY(`collectionId`, `userId`),
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `password_reset_requests` (
	`id` integer PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`userId` integer NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp) NOT NULL,
	`expiresAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_reset_requests_token_unique` ON `password_reset_requests` (`token`);--> statement-breakpoint
CREATE TABLE `recipe_likes` (
	`recipeId` integer NOT NULL,
	`userId` integer NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipe_user_permissions` (
	`recipeId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp) NOT NULL,
	PRIMARY KEY(`recipeId`, `userId`),
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session_scopes` (
	`sessionId` text NOT NULL,
	`scope` text NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp) NOT NULL,
	`expiresAt` integer NOT NULL,
	PRIMARY KEY(`sessionId`, `scope`),
	FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp) NOT NULL,
	PRIMARY KEY(`userId`, `role`),
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `recipe_user_permissions` (`recipeId`, `userId`, `role`) SELECT `recipeId`, `userId`, REPLACE(`role`, 'creator', 'owner') FROM `recipeSubscriptions` WHERE `role` != 'subscriber';
--> statement-breakpoint
INSERT INTO `collection_user_permissions` (`collectionId`, `userId`, `role`) SELECT `collectionId`, `userId`, REPLACE(`role`, 'creator', 'owner') FROM `collectionSubscriptions` WHERE `role` != 'subscriber';
--> statement-breakpoint
INSERT INTO `recipe_likes` (`recipeId`, `userId`) SELECT `recipeId`, `userId` FROM `recipeSubscriptions` WHERE `role` = 'subscriber';
--> statement-breakpoint
INSERT INTO `collection_likes` (`collectionId`, `userId`) SELECT `collectionId`, `userId` FROM `collectionSubscriptions` WHERE `role` = 'subscriber';
--> statement-breakpoint
DROP TABLE `collectionSubscriptions`;--> statement-breakpoint
DROP TABLE `recipeSubscriptions`;--> statement-breakpoint
DROP TABLE `temporaryAssets`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_collection_recipes` (
	`collectionId` integer NOT NULL,
	`recipeId` integer NOT NULL,
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_collection_recipes`("collectionId", "recipeId") SELECT "collectionId", "recipeId" FROM `collection_recipes`;--> statement-breakpoint
DROP TABLE `collection_recipes`;--> statement-breakpoint
ALTER TABLE `__new_collection_recipes` RENAME TO `collection_recipes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`hashedPassword` text NOT NULL,
	`username` text NOT NULL,
	`avatar` text,
	`appPreferencesId` integer NOT NULL,
	`collectionPreferencesId` integer NOT NULL,
	`recipePreferencesId` integer NOT NULL,
	FOREIGN KEY (`appPreferencesId`) REFERENCES `app_preferences`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`collectionPreferencesId`) REFERENCES `collection_preferences`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipePreferencesId`) REFERENCES `recipe_preferences`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "publicId", "hashedPassword", "username", "avatar", "appPreferencesId", "collectionPreferencesId", "recipePreferencesId") SELECT "id", "publicId", "hashedPassword", "username", "avatar", "appPreferencesId", "collectionPreferencesId", "recipePreferencesId" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_publicId_unique` ON `users` (`publicId`);