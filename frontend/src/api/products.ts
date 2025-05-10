// src/api/products.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Certifique-se de que esta é a sua URL base da API

export const getFeaturedProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos?destaque=true`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar produtos em destaque:", error);
    throw error; // Rejogue o erro para quem chamar esta função
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    throw error; // Rejogue o erro para quem chamar esta função
  }
};
