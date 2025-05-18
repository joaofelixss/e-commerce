import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: [
        'https://e-commerce-two-beta-36.vercel.app', // SEM a barra no final
        'http://localhost:3002', // Se você precisa de acesso local
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    await app.listen(process.env.PORT || 3000);
    console.log(`Aplicação rodando na porta ${process.env.PORT || 3000}`);
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
  }
}

bootstrap();
