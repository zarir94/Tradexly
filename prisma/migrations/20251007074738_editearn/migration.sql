/*
  Warnings:

  - You are about to drop the column `role` on the `Earnings` table. All the data in the column will be lost.
  - Added the required column `for` to the `Earnings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Earnings" DROP COLUMN "role",
ADD COLUMN     "for" "UserRole" NOT NULL;
