// frontend/src/hooks/useFetchProducts.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "@/features/produtos/types/product"; // Importe a interface Product

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const useFetchProducts = (categoria?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Limpa o erro ao iniciar uma nova busca
      try {
        let url = `${API_BASE_URL}/produtos`;
        if (categoria) {
          url += `?categoria=${categoria}`;
        }
        const response = await axios.get(url);
        setProducts(response.data.data); 
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar produtos.");
        setLoading(false);
        console.error(
          `Erro ao buscar produtos${categoria ? ` de ${categoria}` : ""}:`,
          err
        );
      }
    };

    fetchData();
  }, [categoria]); // A dependência 'categoria' fará o efeito rodar novamente se a categoria mudar

  return { products, loading, error };
};
