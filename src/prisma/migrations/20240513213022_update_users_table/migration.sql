/*
  Warnings:

  - A unique constraint covering the columns `[order_detail_id]` on the table `feedbacks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_detail_id` to the `feedbacks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `feedbacks` ADD COLUMN `order_detail_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `feedbacks_order_detail_id_key` ON `feedbacks`(`order_detail_id`);

-- AddForeignKey
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_order_detail_id_fkey` FOREIGN KEY (`order_detail_id`) REFERENCES `order_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
