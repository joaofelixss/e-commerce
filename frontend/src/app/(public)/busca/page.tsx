// src/app/(public)/busca/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import { searchProducts } from "@/api/products"; // Importe a função searchProducts
import { Product } from "@/features/produtos/types/product";

const BuscaPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [resultados, setResultados] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const buscarProdutos = async () => {
      setLoading(true);
      setError(null);
      try {
        if (query.trim()) {
          const data = await searchProducts(query);
          setResultados(data.data || []); // Assumindo que os produtos estão em data.data
        } else {
          setResultados([]); // Limpa os resultados se não houver query
        }
        setLoading(false);
      } catch (err: unknown) {
        setError("Erro ao buscar produtos.");
        setResultados([]);
        setLoading(false);
        console.error(`Erro ao buscar produtos com a query "${query}":`, err);
      }
    };

    buscarProdutos();
  }, [query]); // O efeito roda novamente sempre que a 'query' mudar

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      const newQuery = new URLSearchParams();
      newQuery.set("q", searchTerm.trim());
      router.push(`/busca?${newQuery.toString()}`);
      setQuery(searchTerm.trim()); // Atualiza o estado da query para o useEffect
    } else {
      setQuery(""); // Limpa a query se o termo de busca estiver vazio
      router.push("/busca"); // Remove o parâmetro 'q' da URL
    }
  };

  const handleVoltar = () => {
    router.back();
  };

  const handleVerTodos = () => {
    router.push("/produtos");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="sticky top-0 bg-color-background z-10 py-4 shadow-md mb-6">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <Button onClick={handleVoltar} variant="ghost" className="mr-2">
            <ArrowLeft className="h-5 w-5" /> Voltar
          </Button>
          <form onSubmit={handleSearchSubmit} className="flex-grow">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full rounded-md focus:outline-none pr-10"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </form>
          {initialQuery && (
            <Button
              onClick={handleVerTodos}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              Ver Todos
            </Button>
          )}
        </div>
        {initialQuery && (
          <p className="px-4 sm:px-6 lg:px-8 mt-2 text-sm text-gray-600">
            Resultados para:{" "}
            <span className="font-semibold">{initialQuery}</span>
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Carregando resultados...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : resultados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8">
          {resultados.map((produto: Product) => (
            <Link href={`/produtos/${produto.id}`} key={produto.id}>
              <Card className="border shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="relative w-full h-48 sm:h-56 mb-2">
                    <Image
                      src={produto.imagemUrl || "/oferta.png"}
                      alt={produto.nome}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md"
                    />
                  </div>
                  <CardTitle className="text-sm sm:text-base font-semibold truncate">
                    {produto.nome}
                  </CardTitle>
                  <p className="text-gray-600 text-sm sm:text-base">
                    R$ {produto.preco.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : initialQuery && !loading ? (
        <p className="text-center text-gray-600">
          {`Nenhum produto encontrado para "${initialQuery}".`}
        </p>
      ) : (
        <p className="text-center text-gray-600">
          Digite um termo de busca para encontrar produtos.
        </p>
      )}
    </div>
  );
};

export default BuscaPage;
