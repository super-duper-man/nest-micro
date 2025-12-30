import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateProductDto } from './product.dto';
import { rpcBadRequest, rpcNotFound } from '@app/rpc';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) { }

    async createProduct(product: CreateProductDto) {
        if (!product.name || !product.price)
            rpcBadRequest('نام و قیمت وارد نشده است.');

        if (typeof product.price !== 'number' || Number.isNaN(product.price) || product.price < 0)
            rpcBadRequest('مقدار وارد شده برای قیمت صحیح نمی‌باشد.');


        const newProduct = await this.productModel.create(product);

        return newProduct;
    }

    async listProducts() {
        return this.productModel.find().sort({ createdAt: -1 }).exec();
    }

    async getProductById(id: string){
        if(!isValidObjectId(id))
            rpcBadRequest('شناسه مورد وارد شده صحیح نیست.')

        const product = await this.productModel.findById(id);

        if(!product)
            rpcNotFound('محصولی با این مشخه یافت نشد.')

        return product;
    }
}
