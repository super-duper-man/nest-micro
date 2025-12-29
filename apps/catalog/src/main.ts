import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { applyExceptionFilterToMicroServiceLayer } from '@app/rpc';

async function bootstrap() {
  process.title = 'catalog';
  const logger = new Logger('..::CatalogBootstrap::..');
  //const port = Number(process.env.CATALOG_TCP_PORT ?? 3011);
  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const queue = process.env.CATALOG_QUEUE ?? 'catalog_queue';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
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

  applyExceptionFilterToMicroServiceLayer(app);

  app.enableShutdownHooks();

  await app.listen();
  logger.log(`Catalog (RMQ) is listening at ${queue} via ${rmqUrl}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
