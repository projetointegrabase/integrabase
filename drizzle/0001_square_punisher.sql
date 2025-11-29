CREATE TABLE `analysisCache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`athleteId` int NOT NULL,
	`analysisType` varchar(64) NOT NULL,
	`analysisData` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `analysisCache_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `athletes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`dateOfBirth` timestamp NOT NULL,
	`registrationNumber` varchar(64) NOT NULL,
	`categoryBefore` varchar(64) NOT NULL,
	`categoryCurrent` varchar(64) NOT NULL,
	`transitionDate` timestamp NOT NULL,
	`familyContact` text,
	`phone` varchar(32),
	`email` varchar(320),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `athletes_id` PRIMARY KEY(`id`),
	CONSTRAINT `athletes_registrationNumber_unique` UNIQUE(`registrationNumber`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(64) NOT NULL,
	`resourceType` varchar(64),
	`resourceId` int,
	`details` text,
	`ipAddress` varchar(64),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `formResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`formId` int NOT NULL,
	`questionKey` varchar(128) NOT NULL,
	`questionText` text NOT NULL,
	`responseValue` text,
	`responseType` enum('text','number','select','checkbox','scale') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `formResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`athleteId` int NOT NULL,
	`formType` enum('social','psychological','academic','nutritional','medical') NOT NULL,
	`sector` enum('servico_social','psicologia','pedagogia','nutricao','medicina') NOT NULL,
	`submittedBy` int NOT NULL,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`status` enum('draft','completed','reviewed') NOT NULL DEFAULT 'completed',
	CONSTRAINT `forms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','psicologo','pedagogo','assistente_social','nutricionista','medico') NOT NULL DEFAULT 'assistente_social';--> statement-breakpoint
ALTER TABLE `users` ADD `sector` enum('admin','psicologia','pedagogia','servico_social','nutricao','medicina') DEFAULT 'servico_social' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` int DEFAULT 1 NOT NULL;