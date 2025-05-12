// src/app/admin/produtos/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { getAllProducts } from "@/api/products";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddProductModal from "@/components/AddProductModal"; // Importe o modal

interface Product {
  id: string;
  nome: string;
  preco: number;
  // Adicione outras propriedades relevantes aqui
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (err: any) {
      setError("Erro ao carregar os produtos.");
      console.error("Erro ao buscar produtos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Executa a busca de produtos na montagem e quando um novo produto é adicionado

  const handleProductAdded = () => {
    fetchProducts(); // Recarrega a lista de produtos após adicionar um novo
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Gerenciamento de Produtos</h1>
        <Button onClick={() => setIsModalOpen(true)}>Adicionar Produto</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-left">ID</TableHead>
              <TableHead className="px-4 py-2 text-left">Nome</TableHead>
              <TableHead className="px-4 py-2 text-left">Preço</TableHead>
              <TableHead className="px-4 py-2 text-left">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="px-4 py-2 font-medium">
                  {product.id}
                </TableCell>
                <TableCell className="px-4 py-2">{product.nome}</TableCell>
                <TableCell className="px-4 py-2">
                  R$ {product.preco.toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Button size="sm" className="mr-2">
                    Editar
                  </Button>
                  <Button size="sm" variant="destructive">
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddProductModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default ProductsPage;
