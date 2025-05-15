"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updatePassword, updateEmail } from "@/features/autenticacao/api/users"; // Importe as funções da API
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Loader2, ArrowLeft } from "lucide-react";

interface FormError {
  message: string;
  field?: string; // Opcional, para indicar qual campo tem o erro
}

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
  const [profileImage, setProfileImage] = useState<string | null>(null); // URL da imagem
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

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
    } catch (error: any) {
      console.error("Erro ao atualizar a senha:", error);
      let errorMessage =
        error.message || "Erro ao atualizar a senha. Tente novamente.";
      if (error.response?.data?.message) {
        // Tenta pegar a mensagem do backend
        errorMessage = error.response.data.message;
      }
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsPasswordLoading(false);
    }
  };

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
    } catch (error: any) {
      console.error("Erro ao atualizar o email:", error);
      let errorMessage =
        error.message || "Erro ao atualizar o email. Tente novamente.";
      if (error.response?.data?.message) {
        // Tenta pegar a mensagem do backend
        errorMessage = error.response.data.message;
      }
      setEmailError(errorMessage);
      toast.error(errorMessage);
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
      // Simulando o envio da imagem para o servidor (substitua com sua lógica real)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Enviando imagem para o servidor:", profileImage);
      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar foto de perfil:", error);
      setImageError("Erro ao atualizar foto de perfil. Tente novamente.");
      toast.error("Erro ao atualizar foto de perfil. Tente novamente.");
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleGoBack = () => {
    window.history.back(); // Simples navegação para a página anterior
  };

  return (
    <div className="container mx-auto py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={handleGoBack} className="px-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
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
                <AvatarImage
                  src={profileImage || undefined}
                  alt={`Foto de Perfil de ${userName}`}
                />
                <AvatarFallback>
                  {/* Se não tiver imagem, mostra as iniciais do nome do usuário.  Você agora tem o nome do usuário. */}
                  {userName ? userName.substring(0, 2).toUpperCase() : "PF"}
                </AvatarFallback>
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
                    Salvando...
                  </>
                ) : (
                  "Salvar Foto"
                )}
              </Button>
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
                      Salvando...
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
                    id="currentEmail"
                    type="email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    placeholder="Digite seu email atual"
                    className="w-full"
                    readOnly // Torna o campo somente leitura
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300"
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
                      Salvando...
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
