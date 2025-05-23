import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

interface JwtPayload {
  sub: string;
  username: string;
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 🔍 1. Tenta pegar o token do cookie
    const tokenFromCookie = request.cookies?.token;
    this.logger.debug(`Cookie Token: ${tokenFromCookie}`);

    if (!tokenFromCookie) {
      this.logger.warn('Token JWT não encontrado no cookie.');
      throw new UnauthorizedException('Token JWT não encontrado.');
    }

    try {
      // 🔐 2. Verifica o token
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(tokenFromCookie);
      this.logger.debug(
        `Token Verificado. Payload: ${JSON.stringify(payload)}`,
      );

      request.user = payload;

      // 👮 3. Checa role (caso seja necessário)
      if (payload.role === 'admin') {
        return true;
      }

      this.logger.warn(
        `Acesso negado. Usuário '${payload.username}' não tem a role de administrador.`,
      );
      throw new UnauthorizedException(
        'Acesso negado. Requer role de administrador.',
      );
    } catch (error) {
      this.logger.error(`Falha na verificação do token JWT:`, error);
      throw new UnauthorizedException('Token JWT inválido.');
    }
  }
}
