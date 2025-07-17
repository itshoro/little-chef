PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_collection_likes` (
	`collectionId` integer NOT NULL,
	`userId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_collection_likes`("collectionId", "userId", "createdAt") SELECT "collectionId", "userId", "createdAt" FROM `collection_likes`;--> statement-breakpoint
DROP TABLE `collection_likes`;--> statement-breakpoint
ALTER TABLE `__new_collection_likes` RENAME TO `collection_likes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_collection_user_permissions` (
	`collectionId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`collectionId`, `userId`),
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_collection_user_permissions`("collectionId", "userId", "role", "createdAt") SELECT "collectionId", "userId", "role", "createdAt" FROM `collection_user_permissions`;--> statement-breakpoint
DROP TABLE `collection_user_permissions`;--> statement-breakpoint
ALTER TABLE `__new_collection_user_permissions` RENAME TO `collection_user_permissions`;--> statement-breakpoint
CREATE TABLE `__new_password_reset_requests` (
	`id` integer PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`userId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`expiresAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_password_reset_requests`("id", "token", "userId", "createdAt", "expiresAt") SELECT "id", "token", "userId", "createdAt", "expiresAt" FROM `password_reset_requests`;--> statement-breakpoint
DROP TABLE `password_reset_requests`;--> statement-breakpoint
ALTER TABLE `__new_password_reset_requests` RENAME TO `password_reset_requests`;--> statement-breakpoint
CREATE UNIQUE INDEX `password_reset_requests_token_unique` ON `password_reset_requests` (`token`);--> statement-breakpoint
CREATE TABLE `__new_recipe_likes` (
	`recipeId` integer NOT NULL,
	`userId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_recipe_likes`("recipeId", "userId", "createdAt") SELECT "recipeId", "userId", "createdAt" FROM `recipe_likes`;--> statement-breakpoint
DROP TABLE `recipe_likes`;--> statement-breakpoint
ALTER TABLE `__new_recipe_likes` RENAME TO `recipe_likes`;--> statement-breakpoint
CREATE TABLE `__new_recipe_user_permissions` (
	`recipeId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`recipeId`, `userId`),
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_recipe_user_permissions`("recipeId", "userId", "role", "createdAt") SELECT "recipeId", "userId", "role", "createdAt" FROM `recipe_user_permissions`;--> statement-breakpoint
DROP TABLE `recipe_user_permissions`;--> statement-breakpoint
ALTER TABLE `__new_recipe_user_permissions` RENAME TO `recipe_user_permissions`;--> statement-breakpoint
CREATE TABLE `__new_session_scopes` (
	`sessionId` text NOT NULL,
	`scope` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`expiresAt` integer NOT NULL,
	PRIMARY KEY(`sessionId`, `scope`),
	FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session_scopes`("sessionId", "scope", "createdAt", "expiresAt") SELECT "sessionId", "scope", "createdAt", "expiresAt" FROM `session_scopes`;--> statement-breakpoint
DROP TABLE `session_scopes`;--> statement-breakpoint
ALTER TABLE `__new_session_scopes` RENAME TO `session_scopes`;--> statement-breakpoint
CREATE TABLE `__new_user_roles` (
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`userId`, `role`),
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_roles`("userId", "role", "createdAt") SELECT "userId", "role", "createdAt" FROM `user_roles`;--> statement-breakpoint
DROP TABLE `user_roles`;--> statement-breakpoint
ALTER TABLE `__new_user_roles` RENAME TO `user_roles`;