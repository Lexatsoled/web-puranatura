PRAGMA foreign_keys=OFF;--> statement-breakpoint
DROP TABLE IF EXISTS `order_items`;--> statement-breakpoint
DROP TABLE IF EXISTS `orders`;--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`shipping_address` text NOT NULL,
	`payment_method` text NOT NULL,
	`order_notes` text,
	`subtotal` real NOT NULL,
	`shipping` real NOT NULL,
	`tax` real NOT NULL,
	`discount` real DEFAULT 0,
	`total` real NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`product_name` text NOT NULL,
	`product_image` text,
	`variant_id` text,
	`variant_name` text,
	`price` real NOT NULL,
	`quantity` integer NOT NULL,
	`subtotal` real NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
