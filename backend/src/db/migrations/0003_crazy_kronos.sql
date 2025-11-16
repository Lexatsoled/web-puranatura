CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`family_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`is_revoked` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`last_used_at` integer,
	`revoked_at` integer,
	`revoked_reason` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);
--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);
--> statement-breakpoint
CREATE INDEX `sessions_family_id_idx` ON `sessions` (`family_id`);
