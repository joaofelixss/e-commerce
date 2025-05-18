import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa CORS para qualquer origem (teste apenas)
  app.enableCors(true);

  await app.listen(3000);
  console.log('Aplicação rodando na porta 3000');
}

bootstrap();
