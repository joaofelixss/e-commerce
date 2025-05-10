import { Module, forwardRef } from '@nestjs/common'; // <----- IMPORTAR forwardRef
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthModule } from '../auth/auth.module';
import { AppModule } from '../../app.module'; // Mantenha a importação do AppModule

@Module({
  imports: [
    AuthModule,
    forwardRef(() => AppModule), // <----- USAR forwardRef AQUI
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
