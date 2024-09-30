CREATE TABLE `books` (
	`number` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`testament` text NOT NULL,
	`isGospel` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chapters` (
	`number` integer NOT NULL,
	`book_number` integer NOT NULL,
	PRIMARY KEY(`number`, `book_number`)
);
--> statement-breakpoint
CREATE TABLE `verses` (
	`number` integer NOT NULL,
	`text` text NOT NULL,
	`chapter_number` integer NOT NULL,
	`book_number` integer NOT NULL,
	PRIMARY KEY(`number`, `chapter_number`, `book_number`)
);
