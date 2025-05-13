// frontend/src/api/users.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Certifique-se de que esta URL esteja correta

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

export const updatePassword = async (
  data: UpdatePasswordData
): Promise<void> => {
  const token = getToken();
  try {
    await axios.patch(`${API_BASE_URL}/users/password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Senha atualizada com sucesso!");
  } catch (error: any) {
    console.error("Erro ao atualizar senha:", error);
    throw error;
  }
};

export const updateEmail = async (data: UpdateEmailData): Promise<void> => {
  const token = getToken();
  try {
    await axios.patch(`${API_BASE_URL}/users/email`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Email atualizado com sucesso!");
  } catch (error: any) {
    console.error("Erro ao atualizar email:", error);
    throw error;
  }
};
