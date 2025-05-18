"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  updatePassword,
  updateEmail,
  getAdminProfile,
} from "@/features/autenticacao/api/users"; // Importe as funções da API
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft, User } from "lucide-react"; // Importe o ícone User do Lucide
import { cn } from "@/lib/utils"; // Supondo que você tenha uma função cn para classes condicionais
import Link from "next/link";

const LOCAL_STORAGE_PROFILE_IMAGE_KEY = "adminProfileImage";

const SettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(
    localStorage.getItem(LOCAL_STORAGE_PROFILE_IMAGE_KEY) || null
  );
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isRemovingImage, setIsRemovingImage] = useState(false);

  // Função para lidar com a atualização da senha
  const handleUpdatePassword = async () => {
    setPasswordError(null);
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Por favor, preencha todos os campos de senha.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("As novas senhas não coincidem.");
      return;
    }

    setIsPasswordLoading(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      toast.success("Senha atualizada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: unknown) {
      console.error("Erro ao atualizar a senha:", error);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getAdminProfile(); // Use a nova função
        setCurrentEmail(profileData.email);
        setUserName(profileData.nome);
      } catch (error: unknown) {
        console.error("Erro ao buscar perfil:", error);
        toast.error("Erro ao buscar informações do perfil.");
      }
    };

    fetchProfile();
  }, []);

  // Função para lidar com a atualização do email
  const handleUpdateEmail = async () => {
    setEmailError(null);
    if (!currentEmail || !newEmail) {
      setEmailError("Por favor, preencha todos os campos de email.");
      return;
    }

    setIsEmailLoading(true);
    try {
      await updateEmail({ currentEmail, newEmail });
      toast.success("Email atualizado com sucesso!");
      setCurrentEmail("");
      setNewEmail("");
    } catch (error: unknown) {
      console.error("Erro ao atualizar o email:", error);
    } finally {
      setIsEmailLoading(false);
    }
  };

  // Função para lidar com o upload da foto de perfil
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validação do tipo de arquivo (opcional, mas recomendado)
      if (!file.type.startsWith("image/")) {
        setImageError("Por favor, selecione um arquivo de imagem válido.");
        toast.error("Por favor, selecione um arquivo de imagem válido.");
        return;
      }
      setImageError(null); // Limpa qualquer erro anterior

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string); // Converte para string
        }
      };
      reader.readAsDataURL(file); // Lê como base64
    }
  };

  const handleUpdateProfileImage = async () => {
    if (!profileImage) {
      setImageError("Por favor, selecione uma imagem de perfil.");
      toast.error("Por favor, selecione uma imagem de perfil.");
      return;
    }

    setIsImageLoading(true);
    try {
      // SIMULAÇÃO DO ENVIO PARA O SERVIDOR (SUBSTITUA PELA SUA LÓGICA REAL)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Enviando imagem para o servidor:", profileImage);
      toast.success("Foto de perfil atualizada com sucesso!");
      localStorage.setItem(LOCAL_STORAGE_PROFILE_IMAGE_KEY, profileImage); // SALVA NO LOCAL STORAGE
    } catch (error: unknown) {
      console.error("Erro ao atualizar foto de perfil:", error);
      setImageError("Erro ao atualizar foto de perfil. Tente novamente.");
      toast.error("Erro ao atualizar foto de perfil. Tente novamente.");
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleRemoveProfileImage = async () => {
    setIsRemovingImage(true);
    try {
      // SIMULAÇÃO DA REMOÇÃO DA IMAGEM DO SERVIDOR (SUBSTITUA PELA SUA LÓGICA REAL)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.removeItem(LOCAL_STORAGE_PROFILE_IMAGE_KEY);
      setProfileImage(null);
      toast.success("Foto de perfil removida com sucesso!");
    } catch (error: unknown) {
      console.error("Erro ao remover foto de perfil:", error);
      toast.error("Erro ao remover foto de perfil. Tente novamente.");
    } finally {
      setIsRemovingImage(false);
    }
  };

  return (
    <div className="container mx-auto py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="hover:underline">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Configurações da Conta
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Seção de Foto de Perfil */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Foto de Perfil
            </h2>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                {profileImage ? (
                  <AvatarImage
                    src={profileImage}
                    alt={`Foto de Perfil de ${userName}`}
                  />
                ) : (
                  <div
                    className={cn(
                      "flex h-full w-full items-center justify-center rounded-full bg-background",
                      "dark:bg-muted-foreground/10"
                    )}
                  >
                    <User />
                  </div>
                )}
              </Avatar>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {imageError && (
                <p className="text-red-500 text-sm">{imageError}</p>
              )}
              <Button
                onClick={handleUpdateProfileImage}
                disabled={isImageLoading}
                className="w-full"
              >
                {isImageLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvar Foto
                  </>
                ) : (
                  "Salvar Foto"
                )}
              </Button>
              {profileImage && (
                <Button
                  onClick={handleRemoveProfileImage}
                  disabled={isRemovingImage}
                  variant="destructive"
                  className="w-full"
                >
                  {isRemovingImage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removendo...
                    </>
                  ) : (
                    "Remover Foto"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Formulários de Senha e Email */}
        <div className="md:col-span-2 space-y-8">
          {/* Formulário de Mudança de Senha */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
              Mudar Senha
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Senha Atual
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Nova Senha
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmNewPassword"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Confirmar Nova Senha
                  </Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    className="w-full"
                  />
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
                <Button
                  onClick={handleUpdatePassword}
                  disabled={isPasswordLoading}
                  className="w-full md:w-auto"
                >
                  {isPasswordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvar Nova Senha
                    </>
                  ) : (
                    "Salvar Nova Senha"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Formulário de Mudança de Email */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
              Mudar Email
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentEmail"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Email Atual
                  </Label>
                  <Input
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300"
                    id="currentEmail"
                    type="email"
                    value={currentEmail}
                    readOnly // Torna o campo somente leitura
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="newEmail"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Novo Email
                  </Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Digite seu novo email"
                    className="w-full"
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-sm">{emailError}</p>
                )}
                <Button
                  onClick={handleUpdateEmail}
                  disabled={isEmailLoading}
                  className="w-full md:w-auto"
                >
                  {isEmailLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvar Novo Email
                    </>
                  ) : (
                    "Salvar Novo Email"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default SettingsPage;
