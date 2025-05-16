// src/modules/auth/interfaces/jwt-payload.interface.ts
export interface JwtPayload {
  sub: string; // ID do usuário
  username: string;
  role?: string;
  iat?: number;
  exp?: number;
}
