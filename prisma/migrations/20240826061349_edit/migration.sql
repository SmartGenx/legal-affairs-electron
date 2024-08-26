/*
  Warnings:

  - Added the required column `tribunalId` to the `IssueDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IssueDetails" ADD COLUMN     "tribunalId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Agency" (
    "id" SERIAL NOT NULL,
    "legalName" TEXT NOT NULL,
    "providedDocument" TEXT,
    "governmentOfficeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StateIssueAgency" (
    "id" SERIAL NOT NULL,
    "issueId" INTEGER NOT NULL,
    "dateOfPowerOfAttorney" TIMESTAMP(3),
    "agencyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StateIssueAgency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tribunal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tribunal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agency_governmentOfficeId_key" ON "Agency"("governmentOfficeId");

-- AddForeignKey
ALTER TABLE "IssueDetails" ADD CONSTRAINT "IssueDetails_tribunalId_fkey" FOREIGN KEY ("tribunalId") REFERENCES "Tribunal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_governmentOfficeId_fkey" FOREIGN KEY ("governmentOfficeId") REFERENCES "GovernmentOffice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateIssueAgency" ADD CONSTRAINT "StateIssueAgency_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateIssueAgency" ADD CONSTRAINT "StateIssueAgency_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
