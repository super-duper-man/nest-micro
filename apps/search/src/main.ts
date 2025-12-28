import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  process.title = 'search';
  const logger = new Logger('..::SEARCH_TCP_PORT::..');
  //const port = Number(process.env.SEARCH_TCP_PORT ?? 3012);
  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const queue = process.env.SEARCH_QUEUE ?? 'search_queue';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
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
  logger.log(`Search (RMQ) is listening at ${queue} via ${rmqUrl}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
