// src/api/products.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const getProductById = async (id: string | string[]) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    throw error;
  }
};

export const getAllProducts = async (params?: Record<string, unknown>) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos`, { params });
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
      `${API_BASE_URL}/produtos?search=${query}`,
      { params }
    );
    return response.data;
  } catch (error: unknown) {
    console.error(`Erro ao buscar produtos com a query "${query}":`, error);
    throw error;
  }
};

