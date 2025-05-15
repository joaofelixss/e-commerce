export interface StockItem {
  id: string;
  nome: string;
  quantidade: number;
  nivelMinimo?: number | null;
  variacao?: string;
  variacaoId: string;
}
