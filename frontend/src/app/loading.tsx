// src/app/loading.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Circle } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="flex items-center justify-center w-20 h-20 rounded-full border-4 border-purple-500 animate-spin mb-8"
      >
        <Circle className="w-12 h-12 text-purple-500" />
      </motion.div>
      <p className="text-lg text-gray-300 animate-pulse">Carregando...</p>
    </div>
  );
};

export default LoadingPage;
