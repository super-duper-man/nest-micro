import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MediaModule } from './media.module';

async function bootstrap() {
  process.title = 'media';
  const logger = new Logger('..::MediaBootstrap::..');
  const port = Number(process.env.MEDIA_TCP_PORT ?? 3013);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port,
      },
    },
  );

  app.enableShutdownHooks();

  await app.listen();
  logger.log(`Media MiroService (TCP) is running at ${port}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
