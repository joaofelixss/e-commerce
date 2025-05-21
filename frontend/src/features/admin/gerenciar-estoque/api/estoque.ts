import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_LOCAL = "http://localhost:3000";

interface StockItem {
  id: string;
  nome: string;
  sku?: string;
  quantidade: number;
  nivelMinimo?: number;
  // Adicione outras propriedades conforme a sua API
}

export const getStockLevels = async (): Promise<StockItem[]> => {
  try {
    const response = await axios.get(`${backendUrl}/estoque`, {
      withCredentials: true,
    });
    return response.data; // Esperamos um array de objetos StockItem
  } catch (error: unknown) {
    console.error("Erro ao buscar os níveis de estoque:", error);
    throw error;
  }
};

// Função para atualizar o nível de estoque
export const updateStockLevel = async (
  itemId: string,
  newQuantity: number,
  newMinLevel?: number | null
): Promise<void> => {
  try {
    const response = await axios.patch(
      // Ou axios.put, dependendo da sua API
      `${backendUrl}/estoque/${itemId}`, // Endpoint para atualizar o estoque do item (pode ser o ID da variação)
      { quantidade: newQuantity, nivelMinimo: newMinLevel }, // Envia os dados atualizados
      {
        withCredentials: true,
      }
    );
    // Se a requisição for bem-sucedida
    console.log(`Estoque do item ${itemId} atualizado com sucesso.`);
  } catch (error: unknown) {
    console.error(`Erro ao atualizar o estoque do item ${itemId}:`, error);
    throw error;
  }
};

// api/estoque.ts
export const gerarListaEstoque = async () => {
  try {
    const response = await fetch("/api/estoque/disponivel", {
      // Rota para o PDF
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/pdf", // O backend deve estar enviando este header
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "estoque_disponivel.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao gerar e baixar o PDF:", error);
    throw error;
  }
};

// Nova função para buscar a lista de estoque para WhatsApp usando axios
export const getEstoqueWhatsAppText = async (): Promise<string> => {
  try {
    const response = await axios.get(
      `${backendUrl}/estoque/disponivel/whatsapp`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar a lista de estoque para WhatsApp:", error);
    throw error;
  }
};
