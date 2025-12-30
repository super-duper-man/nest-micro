import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './products/product.schema';

@Module({
  imports: [
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(String(process.env.ATLAS_CATALOG_DB)),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
