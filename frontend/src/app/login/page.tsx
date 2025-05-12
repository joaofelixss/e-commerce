// frontend/pages/login.tsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        // Sua rota de login no backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login bem-sucedido
        const accessToken = data.access_token; // Assumindo que o token é retornado como "accessToken"
        localStorage.setItem("accessToken", accessToken); // Armazena o token
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard"); // Redirecionamento para o dashboard
      } else {
        // Falha no login
        toast.error(data.message || "Credenciais inválidas."); // Exibe a mensagem de erro da API
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao tentar fazer login.");
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
          Login
        </h1>
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
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Senha
            </label>
            <Input
              type="password"
              id="password"
              placeholder="Sua senha"
              value={password}
              onChange={handlePasswordChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="bg-foreground text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <Link
              href="/forgot-password"
              className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </form>
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

export default LoginPage;
