/*
  Warnings:

  - Added the required column `updatedAt` to the `property_photos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "areaNet" INTEGER,
ADD COLUMN     "balcony" BOOLEAN DEFAULT false,
ADD COLUMN     "buildingAge" TEXT,
ADD COLUMN     "elevator" BOOLEAN DEFAULT false,
ADD COLUMN     "floorNumber" INTEGER,
ADD COLUMN     "furnished" BOOLEAN DEFAULT false,
ADD COLUMN     "heating" TEXT,
ADD COLUMN     "inComplex" BOOLEAN DEFAULT false,
ADD COLUMN     "kitchen" TEXT,
ADD COLUMN     "parking" TEXT,
ADD COLUMN     "totalFloors" INTEGER,
ADD COLUMN     "usageStatus" TEXT,
ALTER COLUMN "rooms" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "property_photos" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");
