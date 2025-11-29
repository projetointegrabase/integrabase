CREATE TABLE `analysisCache` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`athleteId` integer NOT NULL,
	`analysisType` text NOT NULL,
	`analysisData` text NOT NULL,
	`createdAt` integer NOT NULL,
	`expiresAt` integer
);
--> statement-breakpoint
CREATE TABLE `athletes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`dateOfBirth` integer NOT NULL,
	`registrationNumber` text NOT NULL,
	`categoryBefore` text NOT NULL,
	`categoryCurrent` text NOT NULL,
	`transitionDate` integer NOT NULL,
	`familyContact` text,
	`phone` text,
	`email` text,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `athletes_registrationNumber_unique` ON `athletes` (`registrationNumber`);--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`action` text NOT NULL,
	`resourceType` text,
	`resourceId` integer,
	`details` text,
	`ipAddress` text,
	`timestamp` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `formResponses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`formId` integer NOT NULL,
	`questionKey` text NOT NULL,
	`questionText` text NOT NULL,
	`responseValue` text,
	`responseType` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `forms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`athleteId` integer NOT NULL,
	`formType` text NOT NULL,
	`sector` text NOT NULL,
	`submittedBy` integer NOT NULL,
	`submittedAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`status` text DEFAULT 'completed' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text(64) NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`role` text DEFAULT 'assistente_social' NOT NULL,
	`sector` text DEFAULT 'servico_social' NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`lastSignedIn` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);