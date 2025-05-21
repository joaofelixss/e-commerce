// src/features/checkout/components/CheckoutForm.tsx

"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, CartItem } from "@/features/produtos/store/cartStore";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast, Toaster } from "sonner";
import WhatsappMessageGenerator from "@/features/checkout/components/WhatsappMessageGenerator";
import { createPedido } from "@/api/pedidos";
import {
  CreatePedidoData,
  ViaCepResponse,
} from "@/features/checkout/types/checkout";
import { DadosPessoaisForm } from "./form/DadosPessoaisForm";
import { PagamentoForm } from "./form/PagamentoForm";
import { ObservacoesForm } from "./form/ObservacoesForm";
import { BotaoSubmit } from "./form/BotaoSubmit";
import { EntregaForm } from "./form/EntregaForm";

const CheckoutForm = () => {
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [desejaEntrega, setDesejaEntrega] = useState(false);
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cepError, setCepError] = useState("");
  const [enderecoError, setEnderecoError] = useState("");
  const [numeroError, setNumeroError] = useState("");
  const [formaPagamento, setFormaPagamento] = useState<
    "dinheiro" | "pix" | "cartao"
  >("dinheiro");
  const [frete] = useState(5.0); // Valor fixo do frete
  const [submitting, setSubmitting] = useState(false); // Estado para controlar o envio

  const totalCompra = totalPrice();
  const totalComFrete = desejaEntrega ? totalCompra + frete : totalCompra;

  const [hasMounted, setHasMounted] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setNameError("");
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
    setPhoneError("");
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCep(event.target.value);
    setCepError("");
  };

  const handleEnderecoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndereco(event.target.value);
    setEnderecoError("");
  };

  const handleNumeroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumero(event.target.value);
    setNumeroError("");
  };

  const handleComplementoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setComplemento(event.target.value);
  };

  const handleFormaPagamentoChange = (value: "dinheiro" | "pix" | "cartao") => {
    setFormaPagamento(value);
  };

  const buscarEnderecoPorCep = async (cep: string) => {
    if (!cep || cep.length !== 8) {
      toast.error("CEP inválido.");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) {
        toast.error(`Erro ao buscar CEP: ${response.statusText}`);
        setEndereco("");
        setBairro("");
        setCidade("");
        setUf("");
        return;
      }
      const data: ViaCepResponse = await response.json();

      if (
        data &&
        data.logradouro &&
        data.bairro &&
        data.localidade &&
        data.uf
      ) {
        setEndereco(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setUf(data.uf);
      } else {
        toast.error("CEP não encontrado.");
        setEndereco("");
        setBairro("");
        setCidade("");
        setUf("");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Ocorreu um erro ao tentar buscar o endereço.");
      setEndereco("");
      setBairro("");
      setCidade("");
      setUf("");
    }
  };

  useEffect(() => {
    if (desejaEntrega && cep.length === 8) {
      buscarEnderecoPorCep(cep);
    } else if (!desejaEntrega) {
      setCep("");
      setEndereco("");
      setNumero("");
      setComplemento("");
      setBairro("");
      setCidade("");
      setUf("");
    }
  }, [cep, desejaEntrega]);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Por favor, digite seu nome completo.");
      isValid = false;
    }

    if (!phone.trim()) {
      setPhoneError("Por favor, digite seu telefone com DDD.");
      isValid = false;
    } else if (!/^\d{2}\d{8,9}$/.test(phone)) {
      setPhoneError(
        "Por favor, digite um telefone válido com DDD (ex: 69999999999)."
      );
      isValid = false;
    }

    if (desejaEntrega) {
      if (!cep.trim() || cep.length !== 8) {
        setCepError("Por favor, digite um CEP válido.");
        isValid = false;
      }
      if (!endereco.trim()) {
        setEnderecoError("Por favor, digite o endereço.");
        isValid = false;
      }
      if (!numero.trim()) {
        setNumeroError("Por favor, digite o número.");
        isValid = false;
      }
    }

    return isValid;
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      if (cartItems.length === 0) {
        toast.warning(
          "Seu carrinho está vazio. Adicione itens para fazer o pedido."
        );
        return;
      }

      const message = WhatsappMessageGenerator({
        name,
        phone,
        desejaEntrega,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
        frete,
        cartItems: cartItems as CartItem[],
        totalComFrete,
        formaPagamento,
        notes,
      });

      const whatsappUrl = `https://wa.me/5569992784621?text=${message}`; // A mensagem JÁ está URI encoded

      const pedidoData: CreatePedidoData = {
        produtos: cartItems.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantidade,
        })),
        total: totalComFrete,
        enderecoEntrega: desejaEntrega
          ? {
              cep: cep,
              rua: endereco,
              bairro: bairro,
              cidade: cidade,
              estado: uf,
              numero: numero,
              complemento: complemento || null,
            }
          : null,
        cliente: {
          nome: name,
          telefone: phone,
          endereco: null,
          numero: null,
          complemento: null,
          bairro: null,
          cidade: null,
          uf: null,
          cep: null,
        },
        observacoes: notes || null,
        formaPagamento: formaPagamento,
      };

      setSubmitting(true);
      try {
        const response = await createPedido(pedidoData);
        if (response.success) {
          toast.success("Pedido enviado com sucesso!");
          window.open(whatsappUrl, "_blank");
          clearCart();
          router.push("/pedido-enviado");
        } else {
          toast.error(
            response.message || "Ocorreu um erro ao processar o pedido."
          );
        }
      } catch (error: unknown) {
        console.error("Erro ao enviar pedido para a API:", error);
        toast.error("Ocorreu um erro ao enviar o pedido.");
      } finally {
        setSubmitting(false);
      }
    } else {
      toast.error("Por favor, corrija os erros no formulário.");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8 mb-15 p-4">
      <Toaster richColors />
      <CardTitle className="text-xl text-center font-semibold mb-4">
        Coloque seus dados
      </CardTitle>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <DadosPessoaisForm
            name={name}
            phone={phone}
            handleNameChange={handleNameChange}
            handlePhoneChange={handlePhoneChange}
            nameError={nameError}
            phoneError={phoneError}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="entregaDiferente"
              checked={desejaEntrega}
              onCheckedChange={(checked) => {
                setDesejaEntrega(checked === true); // Garante que 'checked' seja convertido para boolean
              }}
            />
            <Label
              htmlFor="desejaEntrega"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
            >
              Deseja que o produto seja entregue em sua casa?
            </Label>
          </div>

          {desejaEntrega && (
            <EntregaForm
              mostrar={desejaEntrega}
              cep={cep}
              endereco={endereco}
              numero={numero}
              complemento={complemento}
              bairro={bairro}
              cidade={cidade}
              uf={uf}
              frete={frete}
              handleCepChange={handleCepChange}
              handleEnderecoChange={handleEnderecoChange}
              handleNumeroChange={handleNumeroChange}
              handleComplementoChange={handleComplementoChange}
              cepError={cepError}
              enderecoError={enderecoError}
              numeroError={numeroError}
            />
          )}

          <PagamentoForm
            formaPagamento={formaPagamento}
            onChange={handleFormaPagamentoChange}
          />

          <p className="font-semibold">Total: R$ {totalComFrete.toFixed(2)}</p>

          <ObservacoesForm notes={notes} onChange={handleNotesChange} />
          <BotaoSubmit submitting={submitting} />
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
