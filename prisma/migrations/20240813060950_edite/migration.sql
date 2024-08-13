/*
  Warnings:

  - You are about to drop the column `detailsDate` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `detailsDate` on the `LeaveType` table. All the data in the column will be lost.
  - You are about to drop the column `detailsDate` on the `Leaveallocation` table. All the data in the column will be lost.
  - You are about to drop the column `detailsDate` on the `leaveDetails` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `BookOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `license` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `licenseType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "detailsDate";

-- AlterTable
ALTER TABLE "BookOrder" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "LeaveType" DROP COLUMN "detailsDate";

-- AlterTable
ALTER TABLE "Leaveallocation" DROP COLUMN "detailsDate";

-- AlterTable
ALTER TABLE "leaveDetails" DROP COLUMN "detailsDate";

-- AlterTable
ALTER TABLE "license" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "licenseType" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
