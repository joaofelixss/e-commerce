import { Module, forwardRef } from '@nestjs/common'; // <----- IMPORTAR forwardRef
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthModule } from '../auth/auth.module';
import { AppModule } from '../../app.module'; // Mantenha a importação do AppModule
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => AppModule), // <----- USAR forwardRef AQUI
    UsersModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
