import { Module } from '@nestjs/common';
import { AdminProfileController } from './admin-profile-controller';
import { AdminProfileService } from './admin-profile.service';
import { PrismaService } from 'src/prisma/prisma.service'; // Importe seu serviço Prisma
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AdminProfileController],
  providers: [AdminProfileService, PrismaService],
})
export class AdminProfileModule {}
