export interface OrderListItem {
  id: string;
  cliente: { nome: string; email: string };
  criadoEm: Date;
  status: "pendente" | "concluído" | "cancelado";
  total: number;
}

export interface OrderDetail {
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
    name?: string;
  }[];
}