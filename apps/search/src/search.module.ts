import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SearchEventModule } from './searchEvent/search-event.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATALOG_EVENT_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: process.env.CATALOG_QUEUE ?? 'catalog_queue',
          queueOptions: { durable: false }
        }
      }
    ]),
    MongooseModule.forRoot(String(process.env.ATLAS_SEARCH_DB)),
    SearchModule
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule { }
