// src/api/products.ts
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getVariablesByProductId = async (productId: string | string[]) => {
  try {
    const response = await axios.get(
      `${backendUrl}/produtos/${productId}/variacoes` // Use a rota correta para variações
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
  productId: string | string[],
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
      `${backendUrl}/produtos/${productId}/variacoes`, // Use a rota correta para variações
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
  productId: string | string[],
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
      `${backendUrl}/produtos/${productId}/variacoes/${variableId}`, // Use a rota correta para variações
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

export const deleteVariable = async (
  productId: string | string[],
  variableId: string
) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/produtos/${productId}/variacoes/${variableId}` // Use a rota correta para variações
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
