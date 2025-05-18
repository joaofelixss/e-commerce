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
    const response = await axios.get(`${backendUrl}/produtos`, { params });
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar todos os produtos:", error);
    throw error;
  }
};

export const searchProducts = async (
  query: string,
  params?: Record<string, unknown>
) => {
  try {
    const response = await axios.get(
      `${backendUrl}/produtos?search=${query}`,
      { params }
    );
    return response.data;
  } catch (error: unknown) {
    console.error(`Erro ao buscar produtos com a query "${query}":`, error);
    throw error;
  }
};

