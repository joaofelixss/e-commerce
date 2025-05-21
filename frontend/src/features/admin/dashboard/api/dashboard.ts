import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_LOCAL = "http://localhost:3000";

// Faturamento total
export const getTotalRevenue = async (): Promise<number> => {
  try {
    const response = await axios.get(`${backendUrl}/dashboard/revenue`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar faturamento total:", error);
    throw error;
  }
};

// Contagem de pedidos
export const getOrderCounts = async (): Promise<{
  pending: number;
  completed: number;
  cancelled: number;
}> => {
  try {
    const response = await axios.get(`${backendUrl}/dashboard/orders`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar contagem de pedidos:", error);
    throw error;
  }
};

// Produtos com baixo estoque (apenas contagem)
export const getLowStockCount = async (): Promise<number> => {
  try {
    const response = await axios.get(`${backendUrl}/dashboard/low-stock`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar contagem de baixo estoque:", error);
    throw error;
  }
};

// Desempenho de vendas (gráfico)
export const getSalesPerformance = async (): Promise<
  { name: string; Vendas: number }[]
> => {
  try {
    const response = await axios.get(
      `${backendUrl}/dashboard/sales-performance`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar desempenho de vendas:", error);
    throw error;
  }
};

// Pedidos recentes (para dashboard)
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
  try {
    const response = await axios.get(
      `${backendUrl}/dashboard/recent-orders?limit=${limit}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar pedidos recentes:", error);
    throw error;
  }
};

// Produtos com baixo estoque (detalhes)
export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  try {
    const response = await axios.get(
      `${backendUrl}/dashboard/low-stock-products`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar produtos com baixo estoque:", error);
    throw error;
  }
};

// Listar todos os pedidos
export const getAllOrders = async (): Promise<{ pedidos: OrderListItem[] }> => {
  try {
    const response = await axios.get(`${backendUrl}/pedidos`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar todos os pedidos:", error);
    throw error;
  }
};

// Atualizar status do pedido
export const updateOrderStatus = async (
  orderId: string,
  newStatus: "pendente" | "concluído" | "cancelado"
): Promise<void> => {
  try {
    await axios.patch(
      `${backendUrl}/pedidos/${orderId}`,
      { status: newStatus },
      {
        withCredentials: true,
      }
    );
    console.log(`Status do pedido ${orderId} atualizado com sucesso.`);
  } catch (error: unknown) {
    console.error(`Erro ao atualizar o status do pedido ${orderId}:`, error);
    throw error;
  }
};

// Interfaces
interface LowStockProduct {
  id: string;
  nome: string;
  variacao?: { cor?: string; numero?: number };
  quantidade: number;
  nivelMinimo?: number;
}

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
