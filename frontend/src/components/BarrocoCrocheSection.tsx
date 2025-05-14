"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/features/produtos/components/ProductCard";
import { getProductById } from "../api/products"; // Importe a função da API

interface Product {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string;
}

const BarrocoCrocheSection: React.FC = () => {
  const [barrocoProduct, setBarrocoProduct] = useState<Product | null>(null);
  const [crocheProduct, setCrocheProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarroco = async () => {
      try {
        const data = await getProductById("2"); // Busca o produto com ID "2" (barroco)
        setBarrocoProduct(data);
      } catch (err: any) {
        console.error("Erro ao buscar produto barroco (ID 2):", err);
        setError("Erro ao carregar produto barroco.");
      }
    };

    const fetchCroche = async () => {
      try {
        const data = await getProductById("3"); // Busca o produto com ID "3" (croche)
        setCrocheProduct(data);
      } catch (err: any) {
        console.error("Erro ao buscar produto crochê (ID 3):", err);
        setError(
          error
            ? `${error}\nErro ao carregar produto crochê.`
            : "Erro ao carregar produto crochê."
        );
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    setError(null);
    Promise.all([fetchBarroco(), fetchCroche()]);
  }, []);

  if (loading) {
    return <p>Carregando produtos barroco e crochê...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const allProducts = [barrocoProduct, crocheProduct].filter(
    (product): product is Product => product !== null
  );

  if (!allProducts || allProducts.length === 0) {
    return null; // Ou outra mensagem indicando que não há produtos com esses IDs
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
        Barroco e Crochê
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BarrocoCrocheSection;
