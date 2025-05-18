// src/api/products.ts
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getProductById = async (id: string | string[]) => {
  try {
    const response = await axios.get(`${backendUrl}/produtos/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    throw error;
  }
};

export const getAllProducts = async (params?: Record<string, unknown>) => {
  try {
    const url = `${backendUrl}/produtos`;
    console.log("URL da requisição getAllProducts (fetch):", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        "Erro na requisição (fetch):",
        response.status,
        response.statusText
      );
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("Erro ao buscar todos os produtos (fetch):", error);
    throw error;
  }
};

export const searchProducts = async (
  query: string,
  params?: Record<string, unknown>
) => {
  try {
    const response = await axios.get(`${backendUrl}/produtos?search=${query}`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    console.error(`Erro ao buscar produtos com a query "${query}":`, error);
    throw error;
  }
};
