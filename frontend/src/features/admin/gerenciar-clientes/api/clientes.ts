// frontend/src/api/clientes.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const getToken = () => {
  const token = localStorage.getItem("accessToken");
  console.log("Token lido do localStorage:", token);
  return token;
};

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  endereco?: string | null;
  // Adicione outros campos conforme a sua necessidade
}

interface ClienteFormData {
  nome: string;
  email: string;
  telefone?: string | null;
  endereco?: string | null;
}

interface PaginatedResponse<T> {
  data: T[]; // O array de itens está na propriedade 'data'
  total: number;
  currentPage: number;
  totalPages: number;
}

export const getClientes = async (): Promise<Cliente[]> => {
  const token = getToken();
  try {
    const response = await axios.get<PaginatedResponse<Cliente>>(
      `${API_BASE_URL}/clientes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data; // Acessamos a propriedade 'data' para obter o array de clientes
  } catch (error: any) {
    console.error("Erro ao buscar clientes:", error);
    throw error;
  }
};

export const addCliente = async (data: ClienteFormData): Promise<Cliente> => {
  const token = getToken();
  try {
    const response = await axios.post<Cliente>(
      `${API_BASE_URL}/clientes`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao adicionar cliente:", error);
    throw error;
  }
};

export const updateCliente = async (
  id: string,
  data: ClienteFormData
): Promise<Cliente> => {
  const token = getToken();
  try {
    const response = await axios.patch<Cliente>(
      `${API_BASE_URL}/clientes/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao atualizar cliente com ID ${id}:`, error);
    throw error;
  }
};

export const deleteCliente = async (id: string): Promise<void> => {
  const token = getToken();
  try {
    await axios.delete(`${API_BASE_URL}/clientes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`Cliente com ID ${id} deletado com sucesso.`);
  } catch (error: any) {
    console.error(`Erro ao deletar cliente com ID ${id}:`, error);
    throw error;
  }
};
