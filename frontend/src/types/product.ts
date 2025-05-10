export interface Product {
  id: string;
  nome: string;
  preco: number;
  imagemUrl: string;
  // Adicione aqui outras propriedades que seus objetos de produto possuem
  // Por exemplo:
  cor?: string;
  numero?: number;
  categoriaId?: string;
  quantidade?: number;
  estoque?: number;
  nivelMinimo?: number;
  criadoEm?: string; // Ou Date, dependendo de como você quer trabalhar com a data
  atualizadoEm?: string; // Ou Date
}
