/*
  Warnings:

  - You are about to drop the column `description` on the `TicketMessage` table. All the data in the column will be lost.
  - Added the required column `description` to the `SupportTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupportTicket" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TicketMessage" DROP COLUMN "description";
