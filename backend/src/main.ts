import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // ⚠️ CORS configurado corretamente para a Vercel
    app.enableCors({
      origin: [
        'http://localhost:3000', // Para desenvolvimento local
        'https://e-commerce-frontend.vercel.app', // Substitua pela URL real do seu frontend
      ],
      credentials: true, // Deixe true por padrão caso use cookies futuramente
    });

    await app.listen(3000);
    console.log('Aplicação rodando na porta 3000');
  } catch (error) {
    console.error('Erro ao iniciar a aplicação:', error);
  }
}

bootstrap();
