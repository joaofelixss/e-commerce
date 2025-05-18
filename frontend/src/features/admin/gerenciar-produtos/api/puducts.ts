// src/features/admin/gerenciar-produtos/api/products.ts
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const addProduct = async (newProductData: {
  nome: string;
  preco: number /* Adicione outros campos aqui */;
  imagemUrl: string;
  categoriaId: string;
}) => {
  try {
    const response = await axios.post(
      `${backendUrl}/produtos`,
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
    const response = await axios.get(`${backendUrl}/produtos/${id}`);
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
      `${backendUrl}/produtos/${id}`,
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
    const response = await axios.delete(`${backendUrl}/produtos/${id}`);
    return response.data; // Opcional: pode retornar dados sobre a exclusão
  } catch (error: unknown) {
    console.error(`Erro ao deletar produto com ID ${id}:`, error);
    throw error; // Rejogue o erro para quem chamar esta função
  }
};

