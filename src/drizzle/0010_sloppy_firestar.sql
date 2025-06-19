PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_collectionSubscriptions` (
	`collectionId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`collectionId`, `userId`, `role`),
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_collectionSubscriptions`("collectionId", "userId", "role") SELECT "collectionId", "userId", "role" FROM `collectionSubscriptions`;--> statement-breakpoint
DROP TABLE `collectionSubscriptions`;--> statement-breakpoint
ALTER TABLE `__new_collectionSubscriptions` RENAME TO `collectionSubscriptions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_recipeSubscriptions` (
	`recipeId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`recipeId`, `userId`, `role`),
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_recipeSubscriptions`("recipeId", "userId", "role") SELECT "recipeId", "userId", "role" FROM `recipeSubscriptions`;--> statement-breakpoint
DROP TABLE `recipeSubscriptions`;--> statement-breakpoint
ALTER TABLE `__new_recipeSubscriptions` RENAME TO `recipeSubscriptions`;