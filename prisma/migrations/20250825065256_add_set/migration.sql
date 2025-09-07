-- CreateTable
CREATE TABLE "public"."Settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_key_key" ON "public"."Settings"("key");
