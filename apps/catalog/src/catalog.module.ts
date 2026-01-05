import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(String(process.env.ATLAS_CATALOG_DB)),

    ClientsModule.register([
      {
        name: 'SEARCH_EVENT_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: process.env.SEARCH_QUEUE ?? 'search_queue',
          queueOptions: { durable: false }
        }
      }
    ])
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule { }
