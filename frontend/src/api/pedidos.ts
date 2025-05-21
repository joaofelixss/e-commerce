import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_BASE_URL = "http://localhost:3000";

interface PedidoItem {
  produtoId: string;
  quantidade: number;
  // Outras propriedades relevantes do item, se necessário
}

interface EnderecoEntrega {
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
  complemento?: string | null;
}

interface ClienteInfo {
  nome: string;
  telefone: string;
  endereco?: string | null; // Se você não estiver capturando o endereço do cliente separadamente
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  cep?: string | null;
  // Outras informações do cliente, se necessário
}

interface CreatePedidoData {
  produtos: PedidoItem[];
  total: number;
  enderecoEntrega?: EnderecoEntrega | null;
  cliente: ClienteInfo;
  observacoes?: string | null;
  formaPagamento: "dinheiro" | "pix" | "cartao";
  // Outras informações do pedido, se necessário
}

interface CreatePedidoResponse {
  success: boolean;
  message?: string;
  pedidoId?: string; // Se a API retornar o ID do pedido criado
  // Outras informações de sucesso, se necessário
}

export const createPedido = async (
  pedidoData: CreatePedidoData
): Promise<CreatePedidoResponse> => {
  try {
    const response = await axios.post<CreatePedidoResponse>(
      `${backendUrl}/pedidos/checkout`,
      pedidoData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao criar pedido:", error);
    return { success: false, message: "Erro ao criar pedido." };
  }
};
