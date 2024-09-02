/*
  Warnings:

  - Added the required column `decisionDate` to the `Decision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Decision"
ADD COLUMN "decisionDate" TIMESTAMP(3) NOT NULL DEFAULT '2024-09-02 12:00:00';
