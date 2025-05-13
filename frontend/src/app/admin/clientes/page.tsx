"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast, ToastContainer } from "react-toastify";
import { getClientes, deleteCliente } from "@/api/clientes";
import AddClienteModal from "@/features/clientes/components/AddClienteModal";
import EditClienteModal from "@/features/clientes/components/EditClienteModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  endereco?: string | null;
}

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Novo estado para o diálogo de exclusão
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null); // ID do cliente a ser excluído

  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (err: any) {
      setError("Erro ao carregar os clientes.");
      console.error("Erro ao buscar clientes:", err);
      toast.error("Erro ao carregar os clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCliente(null);
  };

  const openDeleteModal = (id: string) => {
    setClienteToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setClienteToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCliente = async () => {
    if (clienteToDelete) {
      try {
        await deleteCliente(clienteToDelete);
        toast.success("Cliente excluído com sucesso!");
        await fetchClientes();
      } catch (error: any) {
        console.error("Erro ao excluir cliente:", error);
        toast.error("Erro ao excluir cliente.");
      } finally {
        closeDeleteModal();
      }
    }
  };

  return (
    <div className="container mx-auto py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin" className="hover:underline mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Gerenciamento de Clientes</h1>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Cliente
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2 text-left">Nome</TableHead>
              <TableHead className="px-4 py-2 text-left">Email</TableHead>
              <TableHead className="px-4 py-2 text-left">Telefone</TableHead>
              <TableHead className="px-4 py-2 text-left">Endereço</TableHead>
              <TableHead className="px-4 py-2 text-left">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="px-4 py-2">{cliente.nome}</TableCell>
                <TableCell className="px-4 py-2">{cliente.email}</TableCell>
                <TableCell className="px-4 py-2">
                  {cliente.telefone || "-"}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {cliente.endereco || "-"}
                </TableCell>
                <TableCell className="px-4 py-2 flex items-center gap-2">
                  <Button size="sm" onClick={() => openEditModal(cliente)}>
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteModal(cliente.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" /> Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddClienteModal
        open={isAddModalOpen}
        onOpenChange={closeAddModal}
        onClienteAdded={fetchClientes}
      />

      <EditClienteModal
        open={isEditModalOpen}
        onOpenChange={closeEditModal}
        cliente={editingCliente}
        onClienteUpdated={fetchClientes}
      />

      <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este cliente? Esta ação é
              irreversível.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" onClick={closeDeleteModal}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCliente}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ClientesPage;
