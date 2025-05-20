// src/api/categories.ts
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_LOCAL = "http://localhost:3000";

export const addCategory = async (newCategoryData: {
  nome: string;
  descricao?: string;
}) => {
  try {
    const response = await axios.post(
      `${backendUrl}/categorias`,
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
    const response = await axios.get(`${backendUrl}/categorias/${id}`);
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
      `${backendUrl}/categorias/${id}`,
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
    const response = await axios.delete(`${backendUrl}/categorias/${id}`);
    return response.data; // Opcional: pode retornar dados sobre a exclusão
  } catch (error: unknown) {
    console.error(`Erro ao deletar categoria com ID ${id}:`, error);
    throw error; // Rejogue o erro para quem chamar esta função
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${backendUrl}/categorias`);
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao carregar todas as categorias:", error);
    throw error;
  }
};
