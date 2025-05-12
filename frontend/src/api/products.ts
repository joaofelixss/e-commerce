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

export const getRelatedProducts = async (productId: string) => {
  try {
    // Adapte o endpoint da API para buscar produtos relacionados
    const response = await axios.get(
      `${API_BASE_URL}/produtos/${productId}/related`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Erro ao buscar produtos relacionados para o produto ID ${productId}:`,
      error
    );
    throw error; // Rejogue o erro para quem chamar esta função
  }
};

export const getAllProducts = async (params?: Record<string, any>) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos`, { params });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar todos os produtos:", error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryName: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/produtos?categoria=${categoryName}`
    ); // Adapte a URL da sua API
    return response.data;
  } catch (error: any) {
    console.error(
      `Erro ao buscar produtos da categoria ${categoryName}:`,
      error
    );
    throw error;
  }
};

export const searchProducts = async (
  query: string,
  params?: Record<string, any>
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/produtos?search=${query}`,
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar produtos com a query "${query}":`, error);
    throw error;
  }
};

export const addProduct = async (newProductData: {
  nome: string;
  preco: number /* Adicione outros campos aqui */;
  imagemUrl: string;
  categoriaId: string;
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/produtos`,
      newProductData
    );
    return response.data; // Retorna os dados do produto criado (opcional)
  } catch (error: any) {
    console.error("Erro ao adicionar novo produto:", error);
    throw error; // Rejogue o erro para quem chamar esta função
  }
};
