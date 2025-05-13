"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="text-4xl sm:text-6xl md:text-8xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
        className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 text-center"
      >
        Página não encontrada 😢
      </motion.p>
      <motion.p
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
        className="text-md sm:text-lg text-muted mb-12 text-center max-w-2xl"
      >
        Desculpe, não conseguimos encontrar a página que você está procurando.
        Verifique se o URL está correto ou volte para a página inicial.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.7 }}
      >
        <Button
          variant="outline"
          className="bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 border-red-500/30
                               transition-all duration-300 flex items-center gap-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
