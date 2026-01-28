CREATE TABLE `creditCardMachines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fundraiserId` int,
	`machineName` varchar(100) NOT NULL,
	`machineNumber` varchar(50) NOT NULL,
	`batchNumber` varchar(50),
	`locationId` int,
	`status` enum('available','assigned','returned','inactive') NOT NULL DEFAULT 'available',
	`batchDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `creditCardMachines_id` PRIMARY KEY(`id`),
	CONSTRAINT `creditCardMachines_machineNumber_unique` UNIQUE(`machineNumber`)
);
--> statement-breakpoint
CREATE TABLE `fundraisers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`customerPhoneId` varchar(50),
	`firstName` varchar(100),
	`lastName` varchar(100),
	`isFoundation` boolean DEFAULT false,
	`isCompany` boolean DEFAULT false,
	`hebrewName` text,
	`email` varchar(320) NOT NULL,
	`address2` text,
	`address3` text,
	`address4` text,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fundraisers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `machineLocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `machineLocations_id` PRIMARY KEY(`id`),
	CONSTRAINT `machineLocations_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `redemptionRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fundraiserId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`checkNumber` varchar(50),
	`checkName` varchar(100),
	`checkMemo` text,
	`status` enum('pending','approved','released','rejected') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `redemptionRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `fundraiserIdIdx` ON `creditCardMachines` (`fundraiserId`);--> statement-breakpoint
CREATE INDEX `machineNumberIdx` ON `creditCardMachines` (`machineNumber`);--> statement-breakpoint
CREATE INDEX `statusIdx` ON `creditCardMachines` (`status`);--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `fundraisers` (`userId`);--> statement-breakpoint
CREATE INDEX `emailIdx` ON `fundraisers` (`email`);--> statement-breakpoint
CREATE INDEX `fundraiserIdIdx` ON `redemptionRequests` (`fundraiserId`);--> statement-breakpoint
CREATE INDEX `statusIdx` ON `redemptionRequests` (`status`);