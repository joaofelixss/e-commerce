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

interface JwtPayload {
  sub: number;
  username: string;
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
  private readonly adminUsername = 'maeDoFelix'; // Defina o nome de usuário do administrador AQUI!

  constructor(private jwtService: JwtService) {}

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

      // Verificar se o nome de usuário do payload corresponde ao nome de usuário do administrador
      if (payload.username === this.adminUsername) {
        return true; // Acesso permitido para o administrador
      } else {
        this.logger.warn(
          `Acesso negado. Usuário '${payload.username}' não é o administrador.`,
        );
        throw new UnauthorizedException(
          'Acesso negado. Não é o administrador.',
        );
      }
    } catch (error) {
      this.logger.error(`Token Verification Failed:`, error); // LOG DO ERRO DE VERIFICAÇÃO
      throw new UnauthorizedException('Token JWT inválido.');
    }
  }
}
