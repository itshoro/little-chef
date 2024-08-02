CREATE TABLE `appPreferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`theme` text DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collectionPreferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`defaultVisibility` text DEFAULT 'public' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collectionRecipes` (
	`collectionId` integer NOT NULL,
	`recipeId` integer NOT NULL,
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `collectionSubscriptions` (
	`collectionId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`collectionId`, `userId`),
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`isCustom` integer,
	`visibility` text,
	`itemCount` integer DEFAULT 0 NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recipePreferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`defaultVisibility` text DEFAULT 'public' NOT NULL,
	`defaultServingSize` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recipeSubscriptions` (
	`recipeId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`recipeId`, `role`, `userId`),
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`recommendedServingSize` integer NOT NULL,
	`cookingTime` integer DEFAULT 0 NOT NULL,
	`preparationTime` integer DEFAULT 0 NOT NULL,
	`visibility` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`likes` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`expiresAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `steps` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`recipeId` integer NOT NULL,
	`order` integer NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`publicId` text NOT NULL,
	`hashedPassword` text NOT NULL,
	`username` text NOT NULL,
	`appPreferencesId` integer NOT NULL,
	`collectionPreferencesId` integer NOT NULL,
	`recipePreferencesId` integer NOT NULL,
	FOREIGN KEY (`appPreferencesId`) REFERENCES `appPreferences`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`collectionPreferencesId`) REFERENCES `collectionPreferences`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipePreferencesId`) REFERENCES `recipePreferences`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collections_publicId_unique` ON `collections` (`publicId`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipes_publicId_unique` ON `recipes` (`publicId`);--> statement-breakpoint
CREATE UNIQUE INDEX `steps_publicId_unique` ON `steps` (`publicId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_publicId_unique` ON `users` (`publicId`);