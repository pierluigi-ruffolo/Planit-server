CREATE TABLE `users`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `surname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `users` ADD UNIQUE `users_email_unique`(`email`);

CREATE TABLE `categories`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `color` VARCHAR(255) NOT NULL DEFAULT '#3498db'
);

CREATE TABLE `tasks`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `category_id` BIGINT UNSIGNED NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `status` VARCHAR(255) NOT NULL DEFAULT 'todo',
    `priority` VARCHAR(255) NOT NULL DEFAULT 'medium',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `scheduled_at` DATETIME NULL
);


ALTER TABLE `tasks` ADD CONSTRAINT `tasks_user_id_foreign` 
    FOREIGN KEY(`user_id`) REFERENCES `users`(`id`) 
    ON DELETE CASCADE;


ALTER TABLE `tasks` ADD CONSTRAINT `tasks_category_id_foreign` 
    FOREIGN KEY(`category_id`) REFERENCES `categories`(`id`) 
    ON DELETE SET NULL;