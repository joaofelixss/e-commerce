// src/api/categories.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Certifique-se de usar a mesma URL base

export const addCategory = async (newCategoryData: {
  nome: string;
  descricao?: string;
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/categorias`,
      newCategoryData
    );
    return response.data; // Retorna os dados da categoria criada (opcional)
  } catch (error: unknown) {
    console.error("Erro ao adicionar nova categoria:", error);
    throw error; // Rejogue o erro para quem chamar esta função
  }
};

export const getCategory = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categorias/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error(`Erro ao buscar categoria com ID ${id}:`, error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  updatedCategoryData: {
    nome: string;
    descricao?: string;
    // Adicione outros campos que podem ser atualizados
  }
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/categorias/${id}`,
      updatedCategoryData
    );
    return response.data; // Retorna os dados da categoria atualizada (opcional)
  } catch (error: unknown) {
    console.error(`Erro ao atualizar categoria com ID ${id}:`, error);
    throw error; // Rejogue o erro para quem chamar esta função
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/categorias/${id}`);
    return response.data; // Opcional: pode retornar dados sobre a exclusão
  } catch (error: unknown) {
    console.error(`Erro ao deletar categoria com ID ${id}:`, error);
    throw error; // Rejogue o erro para quem chamar esta função
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categorias`);
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao carregar todas as categorias:", error);
    throw error;
  }
};
