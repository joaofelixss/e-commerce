// frontend/src/components/RelatedProductsSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation"; // Importe useParams
import { getRelatedProducts } from "../api/products"; // Importe a função da API

interface RelatedProduct {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string;
}

const RelatedProductsSection: React.FC = () => {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams(); // Obtenha o ID do produto da URL

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const data = await getRelatedProducts(id as string);
          setRelatedProducts(data);
        } else {
          setError("ID do produto não encontrado na URL.");
        }
      } catch (err: any) {
        setError("Erro ao carregar produtos relacionados.");
        console.error("Erro ao buscar produtos relacionados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [id]); // Execute o efeito sempre que o ID mudar

  if (loading) {
    return <p>Carregando produtos relacionados...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null; // Ou outra mensagem indicando que não há produtos relacionados
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
        Produtos Relacionados
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsSection;
