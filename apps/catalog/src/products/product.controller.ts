import { Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto, GetProductDtoByIdDto } from './product.dto';

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @MessagePattern('product.create')
    createProduct(@Payload() payload: CreateProductDto) {
        return this.productService.createProduct(payload);
    }

    @MessagePattern('product.listProduct')
    listProducts(){
        return this.productService.listProducts();
    }

    @MessagePattern('product.getProductById')
    getProductById(@Payload() payload: GetProductDtoByIdDto){
        return this.productService.getProductById(payload.id);
    }

}
