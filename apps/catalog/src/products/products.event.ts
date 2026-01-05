import { CreateProductDto } from "./product.dto";

export type ProductCreatedEvent = CreateProductDto & {
    _id: string;
}