// src/api/products.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Certifique-se de que esta é a sua URL base da API

function handleApiError(error: unknown, context: string) {
  if (axios.isAxiosError(error)) {
    console.error(`${context}:`, error.message, error.response?.data);
  } else {
    console.error(`${context} (erro desconhecido):`, error);
  }
  throw error;
}

export const getFeaturedProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos?destaque=true`);
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Erro ao buscar produtos em destaque");
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos/${id}`);
    return response.data;
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    console.error(
      `Erro ao buscar produtos relacionados para o produto ID ${productId}:`,
      error
    );
    throw error; // Rejogue o erro para quem chamar esta função
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

export const getProductsByCategory = async (categoryName: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/produtos?categoria=${categoryName}`
    ); // Adapte a URL da sua API
    return response.data;
  } catch (error: unknown) {
    console.error(
      `Erro ao buscar produtos da categoria ${categoryName}:`,
      error
    );
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
  } catch (error: unknown) {
    console.error("Erro ao adicionar novo produto:", error);
    throw error; // Rejogue o erro para quem chamar esta função
  }
};

export const getProduct = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  updatedProductData: {
    nome: string;
    preco: number;
    imagemUrl: string;
    categoriaId: string;
    // Adicione outros campos que podem ser atualizados
  }
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/produtos/${id}`,
      updatedProductData
    );
    return response.data; // Retorna os dados do produto atualizado (opcional)
  } catch (error: unknown) {
    console.error(`Erro ao atualizar produto com ID ${id}:`, error);
    throw error; // Rejogue o erro para quem chamar esta função
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/produtos/${id}`);
    return response.data; // Opcional: pode retornar dados sobre a exclusão
  } catch (error: unknown) {
    console.error(`Erro ao deletar produto com ID ${id}:`, error);
    throw error; // Rejogue o erro para quem chamar esta função
  }
};

export const getVariablesByProductId = async (productId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/produtos/${productId}/variacoes` // Use a rota correta para variações
    );
    return response.data;
  } catch (error: unknown) {
    console.error(
      `Erro ao buscar variações para o produto ID ${productId}:`,
      error
    );
    throw error;
  }
};

export const addVariable = async (
  productId: string,
  newVariableData: {
    cor: string;
    numero?: number;
    imagemUrl?: string;
    quantidade?: number;
    estoque?: number;
    nivelMinimo?: number;
  }
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/produtos/${productId}/variacoes`, // Use a rota correta para variações
      newVariableData
    );
    return response.data; // Retorna os dados da variação criada
  } catch (error: unknown) {
    console.error(
      `Erro ao adicionar variação ao produto ID ${productId}:`,
      error
    );
    throw error;
  }
};

export const updateVariable = async (
  productId: string,
  variableId: string,
  updatedVariableData: {
    cor?: string;
    numero?: number;
    imagemUrl?: string;
    quantidade?: number;
    estoque?: number;
    nivelMinimo?: number;
  }
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/produtos/${productId}/variacoes/${variableId}`, // Use a rota correta para variações
      updatedVariableData
    );
    return response.data; // Retorna os dados da variação atualizada
  } catch (error: unknown) {
    console.error(
      `Erro ao atualizar variação ID ${variableId} do produto ID ${productId}:`,
      error
    );
    throw error;
  }
};

export const deleteVariable = async (productId: string, variableId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/produtos/${productId}/variacoes/${variableId}` // Use a rota correta para variações
    );
    return response.data; // Opcional: pode retornar dados sobre a exclusão
  } catch (error: unknown) {
    console.error(
      `Erro ao deletar variação ID ${variableId} do produto ID ${productId}:`,
      error
    );
    throw error;
  }
};
