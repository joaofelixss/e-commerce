export interface Variation {
  id: string;
  cor: string;
  numero: number | null;
  imagemUrl: string | null | undefined;
  quantidade: number;
  estoque: number;
  nivelMinimo: number | null;
  produtoId: string;
}

export interface ProductDetails {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  imagemUrl: string | null | undefined;
  categoriaId: string;
  criadoEm: string;
  atualizadoEm: string;
  variacoes: Variation[];
}
