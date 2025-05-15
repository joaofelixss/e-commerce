"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addCliente } from "@/features/admin/gerenciar-clientes/api/clientes"; // Ainda não criamos esta função na API
import { toast } from "react-toastify";

const clienteSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Insira um email válido." }),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface AddClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClienteAdded?: () => void; // Callback para recarregar a lista de clientes
}

const AddClienteModal: React.FC<AddClienteModalProps> = ({
  open,
  onOpenChange,
  onClienteAdded,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
    },
  });

  const onSubmit = async (data: ClienteFormData) => {
    try {
      await addCliente(data); // Precisaremos criar esta função na API
      toast.success("Cliente adicionado com sucesso!");
      reset();
      onOpenChange(false);
      if (onClienteAdded) {
        onClienteAdded(); // Recarrega a lista de clientes na página principal
      }
    } catch (error: any) {
      console.error("Erro ao adicionar cliente:", error);
      toast.error("Erro ao adicionar cliente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo para adicionar um novo cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Nome do cliente"
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Email do cliente"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telefone">Telefone (Opcional)</Label>
            <Input
              id="telefone"
              placeholder="Telefone do cliente"
              {...register("telefone")}
            />
            {errors.telefone && (
              <p className="text-sm text-red-500">{errors.telefone.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endereco">Endereço (Opcional)</Label>
            <Input
              id="endereco"
              placeholder="Endereço do cliente"
              {...register("endereco")}
            />
            {errors.endereco && (
              <p className="text-sm text-red-500">{errors.endereco.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Cliente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClienteModal;
