import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { UsersService } from '../users/users.service'; // Importe o UsersService

interface JwtPayload {
  sub: string; // Alterado para string, pois o ID é UUID
  username: string;
  role?: string; // Adicionado o role ao payload
  iat?: number;
  exp?: number;
}

interface RequestWithHeaders extends Request {
  headers: IncomingHttpHeaders;
  user?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService, // Injete o UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const authHeader = request.headers?.authorization;

    this.logger.debug(`Authorization Header: ${authHeader}`); // LOG DO HEADER

    if (!authHeader?.startsWith('Bearer ')) {
      this.logger.warn('Token JWT não encontrado ou em formato inválido.');
      throw new UnauthorizedException(
        'Token JWT não encontrado ou em formato inválido.',
      );
    }

    const token = authHeader.split(' ')[1];
    this.logger.debug(`Extracted Token: ${token}`); // LOG DO TOKEN EXTRAÍDO

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      this.logger.debug(`Token Verified. Payload: ${JSON.stringify(payload)}`); // LOG DO PAYLOAD VERIFICADO
      request.user = payload;

      // Verificar se a role do usuário no payload é "admin"
      if (payload.role === 'admin') {
        return true; // Acesso permitido para administradores
      } else {
        this.logger.warn(
          `Acesso negado. Usuário '${payload.username}' não tem a role de administrador. Role: ${payload.role}`,
        );
        throw new UnauthorizedException(
          'Acesso negado. Requer role de administrador.',
        );
      }
    } catch (error) {
      this.logger.error(`Token Verification Failed:`, error); // LOG DO ERRO DE VERIFICAÇÃO
      throw new UnauthorizedException('Token JWT inválido.');
    }
  }
}
