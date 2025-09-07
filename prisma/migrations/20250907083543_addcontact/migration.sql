-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "subject" TEXT,
    "message" TEXT,
    "ip" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
