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
