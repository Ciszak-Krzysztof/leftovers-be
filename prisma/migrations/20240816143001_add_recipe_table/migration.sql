/*
  Warnings:

  - The `isPublic` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "isPublic",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "Visibility";
