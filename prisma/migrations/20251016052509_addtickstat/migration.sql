/*
  Warnings:

  - The values [IN_PROGRESS,RESOLVED] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('OPEN', 'ANSWERED', 'REPLIED', 'CLOSED');
ALTER TABLE "public"."SupportTicket" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "SupportTicket" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "public"."TicketStatus_old";
ALTER TABLE "SupportTicket" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;
