// src/app/error.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  statusCode?: number;
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode = 500,
  message = "Ocorreu um erro inesperado.",
}) => {
  const getErrorMessage = (code: number) => {
    switch (code) {
      case 400:
        return "Requisição Inválida.";
      case 401:
        return "Não Autorizado.";
      case 403:
        return "Acesso Proibido.";
      case 404:
        return "Página Não Encontrada.";
      case 405:
        return "Método Não Permitido.";
      case 429:
        return "Muitos Pedidos.";
      case 500:
        return "Erro Interno do Servidor.";
      case 502:
        return "Bad Gateway.";
      case 503:
        return "Serviço Indisponível.";
      case 504:
        return "Timeout do Gateway.";
      default:
        return "Ocorreu um erro.";
    }
  };

  const finalMessage = message || getErrorMessage(statusCode);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="flex items-center gap-4 mb-8"
      >
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center">
          {statusCode}
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
        className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 text-center max-w-2xl"
      >
        {finalMessage}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
        className="flex space-x-4"
      >
        <Button
          variant="outline"
          className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 border-blue-500/30
                               transition-all duration-300"
          onClick={() => (window.location.href = "/")} // Redireciona para a home
        >
          Voltar para a Página Inicial
        </Button>
        <Button
          variant="outline"
          className="bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 hover:text-gray-200 border-gray-500/30
                             transition-all duration-300"
          onClick={() => window.history.back()}
        >
          Voltar
        </Button>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
