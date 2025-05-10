// frontend/pages/dashboard.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.push("/login"); // Redireciona para a página de login se não estiver logado
    }
    // Se você fosse buscar dados do usuário, faria isso aqui
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="text-gray-700">Bem-vinda!</p>
      {/* Adicione aqui o conteúdo do dashboard que sua mãe precisa ver */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Informações</h2>
        <ul className="list-disc list-inside">
          <li>Você está logado.</li>
        </ul>
      </div>
      {/* Adicione mais seções conforme necessário */}
    </div>
  );
};

export default DashboardPage;
