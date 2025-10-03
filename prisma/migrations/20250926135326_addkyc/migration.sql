/*
  Warnings:

  - A unique constraint covering the columns `[kyc_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "kyc_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_kyc_id_key" ON "public"."User"("kyc_id");
