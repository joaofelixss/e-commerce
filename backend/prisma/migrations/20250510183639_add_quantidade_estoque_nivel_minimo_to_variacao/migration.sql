/*
  Warnings:

  - You are about to drop the column `estoque` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `nivelMinimo` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `Produto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "estoque",
DROP COLUMN "nivelMinimo",
DROP COLUMN "quantidade";

-- AlterTable
ALTER TABLE "Variacao" ADD COLUMN     "estoque" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nivelMinimo" INTEGER,
ADD COLUMN     "quantidade" INTEGER NOT NULL DEFAULT 0;
