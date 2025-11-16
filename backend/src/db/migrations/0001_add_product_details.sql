ALTER TABLE `products` ADD COLUMN `compare_at_price` real;
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `categories` text DEFAULT '[]';
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `sku` text;
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `is_featured` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `dosage` text;
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `administration_method` text;
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `detailed_description` text;
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `mechanism_of_action` text;
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `benefits_description` text DEFAULT '[]';
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `health_issues` text DEFAULT '[]';
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `components` text DEFAULT '[]';
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `faqs` text DEFAULT '[]';
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `scientific_references` text DEFAULT '[]';
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `tags` text DEFAULT '[]';
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `price_note` text;
