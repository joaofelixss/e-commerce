// src/express.d.ts
import { JwtPayload } from '@nestjs/jwt';

declare module 'express' {
  interface Request {
    user?: JwtPayload; // Permite que a propriedade 'user' exista e seja do tipo JwtPayload (ou undefined)
  }
}
