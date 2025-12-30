import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UserContext } from '../auth/auth.types';
import { CreateProductDto, GetProductDtoByIdDto } from 'apps/catalog/src/products/product.dto';
import { firstValueFrom } from 'rxjs';
import { mapRpcErrorToHttp } from '@app/rpc';
import { AdminOnly } from '../auth/admin.decorator';
import { Public } from '../auth/public.decorator';

type Product = CreateProductDto & { _id: string; };

@Controller('products')
export class ProductsHttpController {
    constructor(
        @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy
    ) { }

    @Post()
    @AdminOnly()
    async createProduct(
        @CurrentUser() user: UserContext,
        @Body() body: CreateProductDto
    ) {
        let product: Product;
        const payload = { ...body, createdByClerkUserId: user.clerkUserId };
        try {
            product = await firstValueFrom(this.catalogClient.send('product.create', payload));
        } catch (error) {
            mapRpcErrorToHttp(error);
        }

        return product;
    }

    @Get('')
    @Public()
    async listProducts() {
        try {
            return await firstValueFrom(this.catalogClient.send('product.listProduct', {}));
        } catch (error) {
            mapRpcErrorToHttp(error);
        }
    }

    @Get(':id')
    @Public()
    async getProductById(@Param('id') id: GetProductDtoByIdDto) {
        try {
            return await firstValueFrom(this.catalogClient.send('product.getProductById', { id }));
        } catch (error) {
            mapRpcErrorToHttp(error);
        }
    }
}
