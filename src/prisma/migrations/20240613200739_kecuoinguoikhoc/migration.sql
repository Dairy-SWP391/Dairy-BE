/*
  Warnings:

  - Added the required column `ship_category_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `ship_category_id` ENUM('BABY', 'MOMY') NOT NULL;
