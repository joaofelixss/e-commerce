import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_LOCAL = "http://localhost:3000";

// Helpers
const fetchJson = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || `Erro ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Erro em fetch para ${url}:`, error);
    throw error;
  }
};

// Endpoints

export const getTotalRevenue = async (): Promise<number> => {
  return fetchJson<number>(`${backendUrl}/dashboard/revenue`);
};

export const getOrderCounts = async (): Promise<{
  pending: number;
  completed: number;
  cancelled: number;
}> => {
  return fetchJson(`${backendUrl}/dashboard/orders`);
};

export const getLowStockCount = async (): Promise<number> => {
  return fetchJson(`${backendUrl}/dashboard/low-stock`);
};

export const getSalesPerformance = async (): Promise<
  { name: string; Vendas: number }[]
> => {
  return fetchJson(`${backendUrl}/dashboard/sales-performance`);
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
  return fetchJson(`${backendUrl}/dashboard/recent-orders?limit=${limit}`);
};

export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  return fetchJson(`${backendUrl}/dashboard/low-stock-products`);
};

export const getAllOrders = async (): Promise<{ pedidos: OrderListItem[] }> => {
  return fetchJson(`${backendUrl}/pedidos`);
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: "pendente" | "concluído" | "cancelado"
): Promise<void> => {
  await fetchJson(`${backendUrl}/pedidos/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: newStatus }),
  });
  console.log(`Status do pedido ${orderId} atualizado com sucesso.`);
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
