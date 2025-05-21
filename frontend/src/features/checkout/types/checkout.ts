export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface CreatePedidoData {
  produtos: { produtoId: string; quantidade: number }[];
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
  cliente: {
    nome: string;
    telefone: string;
    endereco: string | null;
    numero: string | null;
    complemento: string | null;
    bairro: string | null;
    cidade: string | null;
    uf: string | null;
    cep: string | null;
  };
  observacoes: string | null;
  formaPagamento: "dinheiro" | "pix" | "cartao";
}
