import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'catalog';
  const logger = new Logger('..::CatalogBootstrap::..');
  const port = Number(process.env.CATALOG_TCP_PORT ?? 3011);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
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
  logger.log(`Catalog MiroService (TCP) is running at ${port}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
