/*
  Warnings:

  - The values [INDEX] on the enum `AssetType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `payout` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `closedAt` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `openedAt` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `payoutPerc` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closeAt` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AssetType_new" AS ENUM ('FOREX', 'CRYPTO', 'STOCK', 'COMMODITY');
ALTER TABLE "public"."Asset" ALTER COLUMN "type" TYPE "public"."AssetType_new" USING ("type"::text::"public"."AssetType_new");
ALTER TYPE "public"."AssetType" RENAME TO "AssetType_old";
ALTER TYPE "public"."AssetType_new" RENAME TO "AssetType";
DROP TYPE "public"."AssetType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Asset" DROP COLUMN "payout",
ADD COLUMN     "payoutPerc" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Trade" DROP COLUMN "closedAt",
DROP COLUMN "openedAt",
ADD COLUMN     "closeAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "openAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
