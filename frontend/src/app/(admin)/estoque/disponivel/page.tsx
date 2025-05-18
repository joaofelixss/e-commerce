"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  gerarListaEstoque,
  getEstoqueWhatsAppText,
} from "@/features/admin/gerenciar-estoque/api/estoque"; // Importe a nova função

const GerenciamentoEstoquePage = () => {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [errorPdf, setErrorPdf] = useState<string | null>(null);
  const [loadingWhatsapp, setLoadingWhatsapp] = useState(false);
  const [errorWhatsapp, setErrorWhatsapp] = useState<string | null>(null);
  const [whatsappText, setWhatsappText] = useState<string | null>(null);

  const handleGerarListaEstoquePdfClick = async () => {
    setLoadingPdf(true);
    setErrorPdf(null);
    try {
      await gerarListaEstoque();
      setWhatsappText(null);
    } catch (err: unknown) {
      console.error("Erro ao gerar e baixar a lista de estoque (PDF):", err);
      setErrorPdf("Erro ao gerar e baixar a lista de estoque (PDF).");
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleGerarListaEstoqueWhatsappClick = async () => {
    setLoadingWhatsapp(true);
    setErrorWhatsapp(null);
    try {
      const text = await getEstoqueWhatsAppText();
      setWhatsappText(text);
      setErrorWhatsapp(null);
    } catch (err: unknown) {
      console.error("Erro ao gerar lista de estoque para WhatsApp:", err);
      setErrorWhatsapp("Erro ao gerar lista de estoque para WhatsApp.");
      setWhatsappText(null);
    } finally {
      setLoadingWhatsapp(false);
    }
  };

  return (
    <div>
      <h1>Gerenciamento de Estoque</h1>

      {errorPdf && <div className="text-red-500 mb-4">{errorPdf}</div>}
      <Button
        onClick={handleGerarListaEstoquePdfClick}
        disabled={loadingPdf}
        className="mb-4"
      >
        {loadingPdf
          ? "Gerando e Baixando PDF..."
          : "Gerar Lista de Estoque (PDF)"}
      </Button>
      {loadingPdf && (
        <div className="mt-2 text-sm text-gray-500">Aguarde um momento...</div>
      )}

      {errorWhatsapp && (
        <div className="text-red-500 mb-4">{errorWhatsapp}</div>
      )}
      <Button
        onClick={handleGerarListaEstoqueWhatsappClick}
        disabled={loadingWhatsapp}
        className="mb-4"
      >
        {loadingWhatsapp
          ? "Gerando Lista para WhatsApp..."
          : "Gerar Lista para WhatsApp"}
      </Button>
      {loadingWhatsapp && (
        <div className="mt-2 text-sm text-gray-500">Aguarde um momento...</div>
      )}

      {whatsappText && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h2 className="text-lg font-semibold mb-2">Texto para WhatsApp</h2>
          <pre className="whitespace-pre-wrap">{whatsappText}</pre>
          <p className="text-sm text-gray-600 mt-2">
            Copie o texto acima e cole no WhatsApp.
          </p>
        </div>
      )}
    </div>
  );
};

export default GerenciamentoEstoquePage;
