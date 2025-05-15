import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Sua API está na porta 3000

const getToken = () => {
  const token = localStorage.getItem("accessToken");
  console.log("Token lido do localStorage:", token);
  return token;
};

interface StockItem {
  id: string;
  nome: string;
  sku?: string;
  quantidade: number;
  nivelMinimo?: number;
  // Adicione outras propriedades conforme a sua API
}

export const getStockLevels = async (): Promise<StockItem[]> => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/estoque`, {
      // Endpoint para buscar os níveis de estoque
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Esperamos um array de objetos StockItem
  } catch (error: any) {
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
  const token = getToken();
  try {
    const response = await axios.patch(
      // Ou axios.put, dependendo da sua API
      `${API_BASE_URL}/estoque/${itemId}`, // Endpoint para atualizar o estoque do item (pode ser o ID da variação)
      { quantidade: newQuantity, nivelMinimo: newMinLevel }, // Envia os dados atualizados
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // Se a requisição for bem-sucedida
    console.log(`Estoque do item ${itemId} atualizado com sucesso.`);
  } catch (error: any) {
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
  const token = getToken();
  try {
    const response = await axios.get(
      `${API_BASE_URL}/estoque/disponivel/whatsapp`,
      {
        headers: { Authorization: `Bearer ${token}` }, // Se a rota do WhatsApp também requer autenticação
        responseType: "text", // Esperamos uma resposta de texto
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar a lista de estoque para WhatsApp:", error);
    throw error;
  }
};
