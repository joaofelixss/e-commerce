import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: 'https://e-commerce-two-beta-36.vercel.app', // Permite requisições do frontend na porta 3002
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    await app.listen(3000);
    console.log('Aplicação rodando na porta 3001');
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
  }
}

bootstrap();
