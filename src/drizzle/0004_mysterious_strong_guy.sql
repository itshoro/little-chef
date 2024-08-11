CREATE TABLE `collectionSubscriptions_TMP` (
	`collectionId` integer NOT NULL,
	`userId` integer NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`collectionId`, `userId`, `role`),
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
	PRIMARY KEY(`collectionId`, `userId`, `role`),
	FOREIGN KEY (`collectionId`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `collectionSubscriptions` SELECT * FROM `collectionSubscriptions_TMP`;
--> statement-breakpoint
DROP TABLE `collectionSubscriptions_TMP`;