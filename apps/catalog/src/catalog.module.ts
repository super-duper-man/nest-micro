import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ProductsModule } from './products/products.module';
import { MessagingModule } from './messaging.module';

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(String(process.env.ATLAS_CATALOG_DB)),
    MessagingModule
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule { }
