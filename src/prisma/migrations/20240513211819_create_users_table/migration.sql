/*
  Warnings:

  - You are about to drop the column `product_id` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `image_feedbacks` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parent_id` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent_type` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_price` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimate_price` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_parent_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `image_feedbacks` DROP FOREIGN KEY `image_feedbacks_feedback_id_fkey`;

-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `reports_handler_id_fkey`;

-- DropForeignKey
ALTER TABLE `vouchers` DROP FOREIGN KEY `vouchers_user_id_fkey`;

-- AlterTable
ALTER TABLE `categories` MODIFY `parent_category_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `feedbacks` MODIFY `content` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `images` DROP COLUMN `product_id`,
    ADD COLUMN `parent_id` INTEGER NOT NULL,
    ADD COLUMN `parent_type` ENUM('PRODUCT', 'FEEDBACK', 'POST') NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `total_price`,
    ADD COLUMN `end_price` DOUBLE NOT NULL,
    ADD COLUMN `estimate_price` DOUBLE NOT NULL,
    MODIFY `discount` DOUBLE NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reports` MODIFY `handler_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `avatar_url` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vouchers` MODIFY `user_id` INTEGER NULL;

-- DropTable
DROP TABLE `image_feedbacks`;

-- CreateTable
CREATE TABLE `transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `payment_method` VARCHAR(191) NOT NULL,
    `receive_destination` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `time_stamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `transactions_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `staff_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_lines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_room_id` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `sender` ENUM('MEMBER', 'STAFF') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_phone_number_key` ON `users`(`phone_number`);

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parent_category_id_fkey` FOREIGN KEY (`parent_category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_handler_id_fkey` FOREIGN KEY (`handler_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_rooms` ADD CONSTRAINT `chat_rooms_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_rooms` ADD CONSTRAINT `chat_rooms_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_lines` ADD CONSTRAINT `chat_lines_chat_room_id_fkey` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
