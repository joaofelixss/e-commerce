export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  endereco?: string | null;
}