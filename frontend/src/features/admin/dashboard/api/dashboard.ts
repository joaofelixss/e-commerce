import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const getToken = () => {
  const token = localStorage.getItem("accessToken");
  console.log("Token lido do localStorage:", token);
  return token;
};

export const getTotalRevenue = async (): Promise<number> => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/revenue`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar faturamento total:", error);
    throw error;
  }
};

export const getOrderCounts = async (): Promise<{
  pending: number;
  completed: number;
  cancelled: number;
}> => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar contagem de pedidos:", error);
    throw error;
  }
};

export const getLowStockCount = async (): Promise<number> => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/low-stock`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar contagem de baixo estoque:", error);
    throw error;
  }
};

// Nova função para buscar os dados de desempenho de vendas
export const getSalesPerformance = async (): Promise<
  { name: string; Vendas: number }[]
> => {
  const token = getToken();
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dashboard/sales-performance`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar desempenho de vendas:", error);
    throw error;
  }
};

export const getRecentOrders = async (
  limit: number = 5
): Promise<
  {
    id: string;
    customerName: string;
    orderDate: Date;
    status: "pendente" | "concluído" | "cancelado";
    total: number;
  }[]
> => {
  const token = getToken();
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dashboard/recent-orders?limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar pedidos recentes:", error);
    throw error;
  }
};

export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  const token = getToken();
  try {
    const response = await axios.get(
      `${API_BASE_URL}/dashboard/low-stock-products`,
      {
        // Nova rota no backend
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar produtos com baixo estoque:", error);
    throw error;
  }
};

interface LowStockProduct {
  id: string;
  nome: string;
  variacao?: { cor?: string; numero?: number };
  quantidade: number;
  nivelMinimo?: number;
}

export const getAllOrders = async (): Promise<{ pedidos: OrderListItem[] }> => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/pedidos`, {
      // Use o endpoint /pedidos
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // A resposta agora tem a propriedade 'pedidos'
  } catch (error: any) {
    console.error("Erro ao buscar todos os pedidos:", error);
    throw error;
  }
};

// Defina a interface para um Pedido (para a listagem)
interface OrderListItem {
  id: string;
  cliente: { nome: string; email: string };
  criadoEm: Date;
  status: "pendente" | "concluído" | "cancelado";
  total: number;
  enderecoEntrega: {
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    numero: string;
    complemento: string | null;
  } | null;
  produtos: {
    produtoId: string;
    preco: number;
    quantidade: number;
  }[];
}

// Defina a interface para os detalhes do pedido (para o modal)
interface OrderDetail {
  id: string;
  cliente: { nome: string; email: string };
  criadoEm: Date;
  status: string;
  total: number;
  enderecoEntrega: {
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    numero: string;
    complemento: string | null;
  } | null;
  produtos: {
    produtoId: string;
    preco: number;
    quantidade: number;
    name?: string; // Podemos tentar buscar o nome depois, se necessário
  }[];
}

// Função para atualizar o status do pedido
export const updateOrderStatus = async (
  orderId: string,
  newStatus: "pendente" | "concluído" | "cancelado"
): Promise<void> => {
  const token = getToken();
  try {
    const response = await axios.patch(
      // Ou axios.patch, dependendo da sua API
      `${API_BASE_URL}/pedidos/${orderId}`, // Endpoint para atualizar o pedido
      { status: newStatus }, // Envia o novo status no corpo da requisição
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // Se a requisição for bem-sucedida, a API geralmente retorna um status 200 ou 204
    console.log(`Status do pedido ${orderId} atualizado com sucesso.`);
  } catch (error: any) {
    console.error(`Erro ao atualizar o status do pedido ${orderId}:`, error);
    throw error;
  }
};
