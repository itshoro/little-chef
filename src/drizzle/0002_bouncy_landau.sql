CREATE TABLE `history_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`recipeTrackingEnabled` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipe_histories` (
	`recipeId` integer NOT NULL,
	`userId` integer NOT NULL,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`recipeId`, `userId`),
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `history_preferences` (`userId`, `recipeTrackingEnabled`) SELECT `id`, 1 FROM `users`;