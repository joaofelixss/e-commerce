/*
  Warnings:

  - You are about to drop the column `cor` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `Produto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "cor",
DROP COLUMN "numero";

-- CreateTable
CREATE TABLE "Variacao" (
    "id" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "numero" INTEGER,
    "imagemUrl" TEXT,
    "produtoId" TEXT NOT NULL,

    CONSTRAINT "Variacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Variacao_produtoId_cor_numero_key" ON "Variacao"("produtoId", "cor", "numero");

-- AddForeignKey
ALTER TABLE "Variacao" ADD CONSTRAINT "Variacao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
