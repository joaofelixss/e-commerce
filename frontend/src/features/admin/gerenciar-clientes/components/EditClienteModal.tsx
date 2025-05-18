import React, { useEffect } from "react";
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
import { updateCliente } from "@/features/admin/gerenciar-clientes/api/clientes"; // Importe a função de atualizar cliente
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

interface EditClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: {
    id: string;
    nome: string;
    email: string;
    telefone?: string | null;
    endereco?: string | null;
  } | null;
  onClienteUpdated?: () => void; // Callback para recarregar a lista
}

const EditClienteModal: React.FC<EditClienteModalProps> = ({
  open,
  onOpenChange,
  cliente,
  onClienteUpdated,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: cliente?.nome || "",
      email: cliente?.email || "",
      telefone: cliente?.telefone || "",
      endereco: cliente?.endereco || "",
    },
  });

  useEffect(() => {
    if (cliente) {
      setValue("nome", cliente.nome);
      setValue("email", cliente.email);
      setValue("telefone", cliente.telefone || "");
      setValue("endereco", cliente.endereco || "");
    } else {
      reset();
    }
  }, [cliente, reset, setValue]);

  const onSubmit = async (data: ClienteFormData) => {
    if (!cliente?.id) {
      console.error("Erro: ID do cliente não encontrado para edição.");
      toast.error("Erro ao editar cliente.");
      return;
    }
    try {
      await updateCliente(cliente.id, data);
      toast.success("Cliente atualizado com sucesso!");
      reset();
      onOpenChange(false);
      if (onClienteUpdated) {
        onClienteUpdated();
      }
    } catch (error: unknown) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Edite as informações do cliente abaixo.
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
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClienteModal;
