export interface Product {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string;
  cor?: string;
  numero?: number;
  categoriaId?: string;
  quantidade?: number;
  estoque?: number;
  nivelMinimo?: number;
  criadoEm?: string;
  atualizadoEm?: string;
}
