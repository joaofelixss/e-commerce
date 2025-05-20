import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_LOCAL = "http://localhost:3000";

// Defina as interfaces com base na sua API Nest.js
interface ProdutoVenda {
  produtoId: string;
  variacaoId?: string;
  quantidade: number;
  precoVenda: number;
  custoUnitario?: number;
}

export interface Venda {
  id: string;
  pedidoId?: string;
  clienteId?: string;
  dataVenda: string;
  totalVenda: number;
  formaPagamento?: string;
  observacoes?: string;
  itensVenda: ItemVenda[];
  pedido?: Order; // Se você quiser incluir os dados do pedido na resposta
  cliente?: Cliente; // Se você quiser incluir os dados do cliente na resposta
  criadoEm: string;
  atualizadoEm: string;
}

interface ItemVenda {
  id: string;
  vendaId: string;
  produtoId: string;
  variacaoId?: string;
  quantidade: number;
  precoVenda: number;
  custoUnitario?: number;
  subtotal: number;
  lucroItem?: number;
  produto: Produto; 
  variacao?: Variacao; 
}

export interface Order {
  id: string;
  produtos: unknown; 
  status: string;
  total: number;
  criadoEm: string;
  pedidos?: string;
  clienteId?: string;
  cliente?: Cliente;
  formaPagamento?: string;
  observacoes?: string;
  enderecoEntrega?: unknown;
  venda?: Venda; 
}

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
}

interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string;
  categoriaId: string;
  criadoEm: string;
  atualizadoEm: string;
  variacoes: Variacao[];
}

interface Variacao {
  id: string;
  cor: string;
  numero?: number;
  imagemUrl?: string;
  quantidade: number;
  estoque: number;
  nivelMinimo?: number;
  produtoId: string;
  custoCompra?: number;
}

interface AddManualSalePayload {
  clienteId?: string; // Use clienteId para associar a um cliente existente
  formaPagamento?: string;
  observacoes?: string;
  itens: ProdutoVenda[]; // Array de itens da venda
  dataVenda?: string; // Formato YYYY-MM-DD (opcional, padrão é a data atual no backend)
}

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get<Order[]>(`${backendUrl}/pedidos`); // Ajuste o endpoint se necessário
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar pedidos:", error);
    throw error;
  }
};

export const getSales = async (): Promise<Venda[]> => {
  try {
    const response = await axios.get<Venda[]>(`${backendUrl}/vendas`); // Endpoint para buscar todas as vendas
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar vendas:", error);
    throw error;
  }
};

export const addManualSale = async (
  payload: AddManualSalePayload
): Promise<Venda> => {
  try {
    const response = await axios.post<Venda>(
      `${backendUrl}/vendas`, // Endpoint para criar vendas (manuais ou a partir de pedidos)
      payload
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao adicionar venda manual:", error);
    throw error;
  }
};

// Outras funções relacionadas a vendas (ex: getSaleDetails, cancelSale, etc.) podem ser adicionadas aqui
