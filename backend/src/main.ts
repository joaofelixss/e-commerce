import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: true,
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
