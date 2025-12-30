import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import type { ProductStatus } from "./product.schema";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsString()
    status?: ProductStatus = 'DRAFT';

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsString()
    createdByClerkUserId: string;
}

export class GetProductDtoByIdDto {
    @IsString()
    id: string;
}