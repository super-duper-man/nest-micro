import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('..::GatewayBootstrap::..');
  const app = await NestFactory.create(GatewayModule);
  app.enableShutdownHooks();
  const port = Number(process.env.GATEWAY_PORT ?? 3000);
  await app.listen(port);
  logger.log(`Gateway is running at ${port}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
