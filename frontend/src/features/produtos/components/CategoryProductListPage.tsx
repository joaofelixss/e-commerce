// src/features/produtos/components/CategoryProductListPage.tsx
"use client";

import React from "react";
import ProductCard from "@/features/produtos/components/ProductCard";
import { useFetchProducts } from "@/features/produtos/hooks/useFetchProducts";
import { useRouter } from "next/navigation"; // Import useRouter para obter a categoria da URL

interface CategoryProductListPageProps {
  category: string;
  pageTitle: string;
  emptyMessage: string;
}

export default function CategoryProductListPage({
  category,
  pageTitle,
  emptyMessage,
}: CategoryProductListPageProps) {
  const { products, loading, error } = useFetchProducts(category);

  if (loading) {
    return <div>Carregando produtos de {category}...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
      {products.length === 0 && !loading && !error && <div>{emptyMessage}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((produto) => (
          <ProductCard key={produto.id} product={produto} />
        ))}
      </div>
    </div>
  );
}
