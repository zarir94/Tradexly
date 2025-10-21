/*
  Warnings:

  - You are about to drop the column `message` on the `TicketMessage` table. All the data in the column will be lost.
  - Added the required column `description` to the `TicketMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `html` to the `TicketMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketMessage" DROP COLUMN "message",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "html" TEXT NOT NULL;
