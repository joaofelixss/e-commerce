"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, CartItem } from "@/features/produtos/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import { FaWhatsapp } from "react-icons/fa";
import WhatsappMessageGenerator from "@/features/checkout/components/WhatsappMessageGenerator"; // Import o componente
import { createPedido } from "@/api/pedidos";

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

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

  const totalCompra = totalPrice();
  const totalComFrete = desejaEntrega ? totalCompra + frete : totalCompra;

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
      const data: ViaCepResponse = await response.json();

      if (!data.erro) {
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
      toast.error("Ocorreu um erro ao tentar buscar o endereço.", {
        title: "Erro ao buscar CEP",
      });
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      if (cartItems.length === 0) {
        toast.warning(
          "Seu carrinho está vazio. Adicione itens para fazer o pedido."
        );
        return;
      }

      const whatsappMessage = WhatsappMessageGenerator({
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

      const pedidoData: CreatePedidoData = {
        produtos: cartItems.map((item) => ({
          produtoId: item.id,
          quantidade: item.quantity,
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
          endereco: null, // Você já está enviando o endereço de entrega separadamente
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
          window.open(
            `https://wa.me/5569992784621?text=${whatsappMessage}`,
            "_blank"
          );
          clearCart();
          router.push("/pedido-enviado");
        } else {
          toast.error(
            response.message || "Ocorreu um erro ao processar o pedido."
          );
        }
      } catch (error: any) {
        console.error("Erro ao enviar pedido para a API:", error);
        toast.error("Ocorreu um erro ao enviar o pedido.");
      } finally {
        setSubmitting(false);
      }
    } else {
      toast.error("Por favor, corrija os erros no formulário.");
    }
  };

  // Adicione um estado para controlar o envio do formulário
  const [submitting, setSubmitting] = useState(false);
  return (
    <Card className="max-w-md mx-auto mt-8 mb-15 p-4">
      <Toaster richColors />
      <CardTitle className="text-xl text-center font-semibold mb-4">
        Coloque seus dados
      </CardTitle>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="name">Nome Completo:</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              required
            />
            {nameError && (
              <p className="text-red-500 text-xs italic">{nameError}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Telefone (com DDD):</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
            {phoneError && (
              <p className="text-red-500 text-xs italic">{phoneError}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="desejaEntrega"
              name="desejaEntrega"
              checked={desejaEntrega}
              onCheckedChange={setDesejaEntrega}
            />
            <Label
              htmlFor="desejaEntrega"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
            >
              Deseja que o produto seja entregue em sua casa?
            </Label>
          </div>

          {desejaEntrega && (
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP:</Label>
                <Input
                  type="text"
                  id="cep"
                  name="cep"
                  value={cep}
                  onChange={handleCepChange}
                  maxLength={8}
                  required
                />
                {cepError && (
                  <p className="text-red-500 text-xs italic">{cepError}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="endereco">Endereço:</Label>
                <Input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={endereco}
                  onChange={handleEnderecoChange}
                  required
                />
                {enderecoError && (
                  <p className="text-red-500 text-xs italic">{enderecoError}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="numero">Número:</Label>
                <Input
                  type="text"
                  id="numero"
                  name="numero"
                  value={numero}
                  onChange={handleNumeroChange}
                  required
                />
                {numeroError && (
                  <p className="text-red-500 text-xs italic">{numeroError}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="complemento">Complemento (opcional):</Label>
                <Input
                  type="text"
                  id="complemento"
                  name="complemento"
                  value={complemento}
                  onChange={handleComplementoChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bairro">Bairro:</Label>
                <Input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={bairro}
                  readOnly
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cidade">Cidade:</Label>
                <Input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={cidade}
                  readOnly
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="uf">UF:</Label>
                <Input type="text" id="uf" name="uf" value={uf} readOnly />
              </div>
              <p className="text-gray-600 text-sm italic">
                Frete: R$ {frete.toFixed(2)}
              </p>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="formaPagamento">Forma de Pagamento:</Label>
            <Select
              value={formaPagamento}
              onValueChange={handleFormaPagamentoChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="pix">Pix</SelectItem>
                <SelectItem value="cartao">Cartão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="font-semibold">Total: R$ {totalComFrete.toFixed(2)}</p>

          <div className="space-y-1">
            <Label htmlFor="notes">Observações Adicionais:</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              value={notes}
              onChange={handleNotesChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-foreground text-background font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <FaWhatsapp className="w-6 h-6" />
            Enviar Pedido via WhatsApp
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
