ALTER TABLE `collectionSubscriptions` RENAME TO `collectionSubscriptions_old`;
--> statement-breakpoint
ALTER TABLE `collectionRecipes` RENAME TO `collectionRecipes_old`;
--> statement-breakpoint
CREATE TABLE `collectionRecipes` (
	`collectionId` integer NOT NULL,
	`recipeId` integer NOT NULL,
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `collectionSubscriptions` (
	`collectionId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`collectionId`, `userId`),
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `collectionRecipes` SELECT * FROM `collectionRecipes_old`;
--> statement-breakpoint
INSERT INTO `collectionSubscriptions` SELECT * FROM `collectionSubscriptions_old`;
--> statement-breakpoint
DROP TABLE `collectionSubscriptions_old`;
--> statement-breakpoint
DROP TABLE `collectionRecipes_old`;