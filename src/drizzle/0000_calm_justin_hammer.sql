CREATE TABLE `app_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`theme` text DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collection_likes` (
	`collectionId` integer NOT NULL,
	`userId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`collectionId`, `userId`),
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `collection_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`defaultVisibility` text DEFAULT 'public' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collection_recipes` (
	`collectionId` integer NOT NULL,
	`recipeId` integer NOT NULL,
	PRIMARY KEY(`collectionId`, `recipeId`),
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `collection_user_permissions` (
	`collectionId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`collectionId`, `userId`),
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`visibility` text NOT NULL,
	`itemCount` integer DEFAULT 0 NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collections_publicId_unique` ON `collections` (`publicId`);--> statement-breakpoint
CREATE TABLE `file_references` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`url` text NOT NULL,
	`mimeType` text NOT NULL,
	`byteSize` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`expiresAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `file_references_publicId_unique` ON `file_references` (`publicId`);--> statement-breakpoint
CREATE UNIQUE INDEX `file_references_url_unique` ON `file_references` (`url`);--> statement-breakpoint
CREATE TABLE `password_reset_requests` (
	`id` integer PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`userId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`expiresAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_reset_requests_token_unique` ON `password_reset_requests` (`token`);--> statement-breakpoint
CREATE TABLE `recipe_likes` (
	`recipeId` integer NOT NULL,
	`userId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`recipeId`, `userId`),
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipe_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`defaultVisibility` text DEFAULT 'public' NOT NULL,
	`defaultServingSize` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `steps` (
	`recipeId` integer NOT NULL,
	`order` integer NOT NULL,
	`description` text NOT NULL,
	PRIMARY KEY(`recipeId`, `order`),
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipe_user_permissions` (
	`recipeId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`recipeId`, `userId`),
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`description` text,
	`recommendedServingSize` integer NOT NULL,
	`cookingTime` integer DEFAULT 0 NOT NULL,
	`preparationTime` integer DEFAULT 0 NOT NULL,
	`visibility` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL,
	`coverId` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`coverId`) REFERENCES `file_references`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_publicId_unique` ON `recipes` (`publicId`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`secretHash` blob NOT NULL,
	`lastVerifiedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`userId`, `role`),
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`sessionId` text NOT NULL,
	`userId` integer NOT NULL,
	PRIMARY KEY(`sessionId`, `userId`),
	FOREIGN KEY (`sessionId`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`hashedPassword` text NOT NULL,
	`username` text NOT NULL,
	`avatarId` integer,
	`role` text DEFAULT 'user' NOT NULL,
	`appPreferencesId` integer NOT NULL,
	`collectionPreferencesId` integer NOT NULL,
	`recipePreferencesId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`avatarId`) REFERENCES `file_references`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`appPreferencesId`) REFERENCES `app_preferences`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`collectionPreferencesId`) REFERENCES `collection_preferences`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipePreferencesId`) REFERENCES `recipe_preferences`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_publicId_unique` ON `users` (`publicId`);