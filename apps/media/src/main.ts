import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MediaModule } from './media.module';

async function bootstrap() {
  process.title = 'media';
  const logger = new Logger('..::MediaBootstrap::..');
  //const port = Number(process.env.MEDIA_TCP_PORT ?? 3013);
  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const queue = process.env.MEDIA_QUEUE ?? 'media_queue';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  app.enableShutdownHooks();

  await app.listen();
  logger.log(`Media (RMQ) is listening at ${queue} via ${rmqUrl}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
