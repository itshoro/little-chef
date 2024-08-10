CREATE TABLE `collectionRecipes_TMP` (
	`collectionId` integer NOT NULL,
	`recipeId` integer NOT NULL,
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `collectionRecipes_TMP` SELECT * FROM `collectionRecipes`;
--> statement-breakpoint
DROP TABLE `collectionRecipes`;
--> statement-breakpoint
CREATE TABLE `collectionRecipes` (
	`collectionId` integer NOT NULL,
	`recipeId` integer NOT NULL,
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `collectionRecipes` SELECT * FROM `collectionRecipes_TMP`;
--> statement-breakpoint
DROP TABLE `collectionRecipes_TMP`;
--> statement-breakpoint



CREATE TABLE `collectionSubscriptions_TMP` (
	`collectionId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`collectionId`, `userId`),
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `collectionSubscriptions_TMP` SELECT * FROM `collectionSubscriptions`;
--> statement-breakpoint
DROP TABLE `collectionSubscriptions`;
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
INSERT INTO `collectionSubscriptions` SELECT * FROM `collectionSubscriptions_TMP`;
--> statement-breakpoint
DROP TABLE `collectionSubscriptions_TMP`;
--> statement-breakpoint