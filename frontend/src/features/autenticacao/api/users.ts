// /src/features/admin/autenticacao/api/users.ts
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface UpdateEmailData {
  currentEmail: string;
  newEmail: string;
}

interface AdminProfileResponse {
  id: string;
  nome: string;
  email: string;
  role: string;
  // Adicione outras propriedades que o backend retorna
}

export const updatePassword = async (
  data: UpdatePasswordData
): Promise<void> => {
  try {
    await axios.patch(`${backendUrl}/admin/profile/change-password`, data, {
      withCredentials: true, // Envia o cookie com o JWT
    });
    console.log("Senha atualizada com sucesso!");
  } catch (error: unknown) {
    console.error("Erro ao atualizar senha:", error);
    throw error;
  }
};

export const updateEmail = async (data: UpdateEmailData): Promise<void> => {
  try {
    await axios.patch(`${backendUrl}/admin/profile/change-email`, data, {
      withCredentials: true, // Envia o cookie com o JWT
    });
    console.log("Email atualizado com sucesso!");
  } catch (error: unknown) {
    console.error("Erro ao atualizar email:", error);
    throw error;
  }
};

export const getAdminProfile = async (): Promise<AdminProfileResponse> => {
  try {
    const response = await axios.get<AdminProfileResponse>(
      `${backendUrl}/admin/profile`,
      {
        withCredentials: true, // Envia o cookie com o JWT
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar perfil:", error);
    throw error;
  }
};
