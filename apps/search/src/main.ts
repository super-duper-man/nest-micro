import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  process.title = 'search';
  const logger = new Logger('..::SEARCH_TCP_PORT::..');
  const port = Number(process.env.SEARCH_TCP_PORT ?? 3012);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
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
  logger.log(`Search MiroService (TCP) is running at ${port}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
