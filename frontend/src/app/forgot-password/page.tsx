// frontend/pages/forgot-password.tsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      toast.error("Por favor, insira seu e-mail.");
      return;
    }

    setIsLoading(true);

    // Simulação de envio de e-mail de recuperação de senha (substitua pela sua lógica real)
    try {
      console.log("Solicitando recuperação de senha para:", email);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simula envio de e-mail

      toast.success(`Um link de recuperação foi enviado para ${email}.`);
      setEmail(""); // Limpa o campo de e-mail após o envio
    } catch (error: any) {
      toast.error(
        error.message || "Ocorreu um erro ao solicitar a recuperação."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="container mx-auto p-8 bg-white shadow-md rounded-md max-w-md">
        <Button
          variant="ghost"
          className="absolute top-4 left-4"
          onClick={handleBack}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
        </Button>
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Esqueceu a Senha
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          Informe seu e-mail para receber um link de recuperação.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={handleEmailChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <Button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800"
          >
            Lembrou a senha? Fazer Login
          </Link>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
