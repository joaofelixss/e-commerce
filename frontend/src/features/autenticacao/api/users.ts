// /src/features/admin/autenticacao/api/users.ts
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_LOCAL = "http://localhost:3000";

const getToken = () => {
  const token = localStorage.getItem("accessToken");
  console.log("Token lido do localStorage:", token);
  return token;
};

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
  const token = getToken();
  try {
    await axios.patch(`${backendUrl}/admin/profile/change-password`, data, {
      // Endpoint corrigido
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Senha atualizada com sucesso!");
  } catch (error: unknown) {
    console.error("Erro ao atualizar senha:", error);
    throw error;
  }
};

export const updateEmail = async (data: UpdateEmailData): Promise<void> => {
  const token = getToken();
  try {
    await axios.patch(`${backendUrl}/admin/profile/change-email`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Email atualizado com sucesso!");
  } catch (error: unknown) {
    console.error("Erro ao atualizar email:", error);
    throw error;
  }
};

// NOVA FUNÇÃO PARA BUSCAR O PERFIL
export const getAdminProfile = async (): Promise<AdminProfileResponse> => {
  const token = getToken();
  try {
    const response = await axios.get<AdminProfileResponse>(
      `${backendUrl}/admin/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar perfil:", error);
    throw error;
  }
};
