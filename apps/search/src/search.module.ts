import { Module, Search } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SearchEventModule } from './searchEvent/search-event.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SearchProduct, SearchProductSchema } from './searchEvent/search-index.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(String(process.env.ATLAS_SEARCH_DB)),
    MongooseModule.forFeature([{ name: SearchProduct.name, schema: SearchProductSchema }]),
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
    SearchEventModule
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule { }
