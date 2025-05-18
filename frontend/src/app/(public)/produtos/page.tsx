// src/app/(public)/produtos/page.tsx
"use client";

import React from "react";
import ProductCard from "@/features/produtos/components/ProductCard";
import { useFetchProducts } from "@/features/produtos/hooks/useFetchProducts";
import { useSearchParams } from "next/navigation"; // Importe useSearchParams

export default function ProductListPage() {
  const searchParams = useSearchParams(); // Use o hook para acessar os search params
  const categoria = searchParams.get("categoria"); // Obtenha o valor da categoria

  const { products, loading, error } = useFetchProducts(categoria);

  const title = categoria
    ? `Lista de Produtos - ${
        categoria.charAt(0).toUpperCase() + categoria.slice(1)
      }`
    : "Lista de Produtos";

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        Carregando produtos de {categoria || "todos"}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-red-500">
        Erro ao carregar produtos: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600">
          Nenhum produto encontrado na categoria {categoria || "todos"}.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((produto) => (
          <ProductCard key={produto.id} product={produto} />
        ))}
      </div>
    </div>
  );
}
