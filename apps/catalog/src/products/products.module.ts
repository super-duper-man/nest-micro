import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { ProductEventsPublisher } from '../events/product-events.publisher';
import { MessagingModule } from '../messaging.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Product.name,
      schema: ProductSchema
    }]),
    MessagingModule
  ],
  providers: [ProductService, ProductEventsPublisher],
  controllers: [ProductController],
})
export class ProductsModule { }
