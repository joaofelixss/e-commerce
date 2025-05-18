import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3000);
    console.log('Aplicação rodando na porta 3001');
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
  }
}

bootstrap();
