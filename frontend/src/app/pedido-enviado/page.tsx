"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PedidoEnviadoPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Opcional: Redirecionar para a página inicial após alguns segundos
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000); // Redireciona após 5 segundos

    return () => clearTimeout(timer); // Limpar o timer se o componente for desmontado
  }, [router]);

  return (
    <div className="container mx-auto py-12 flex justify-center items-center h-screen">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
          <CheckCircleIcon className="w-16 h-16 text-foreground" />
          <CardTitle className="text-2xl font-bold text-foreground">
            Pedido Enviado com Sucesso!
          </CardTitle>
          <p className="text-gray-700">
            Agradecemos o seu pedido! Em breve entraremos em contato pelo
            WhatsApp para confirmar os detalhes e o pagamento.
          </p>
          <p className="text-sm text-gray-500">
            Você será redirecionado para a página inicial em alguns segundos...
          </p>
          {/* Opcional: Adicionar um link para a página inicial */}
          <Link href="/" className="text-foreground hover:underline">
            <Button variant="outline" size="sm">
              Voltar para a página inicial
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default PedidoEnviadoPage;
