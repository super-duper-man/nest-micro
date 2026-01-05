import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ProductCreatedEvent } from "../products/products.event";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ProductEventsPublisher implements OnModuleInit{
    private readonly logger = new Logger(ProductEventsPublisher.name);

    constructor(@Inject('SEARCH_EVENT_CLIENT') private readonly searchEventClient: ClientProxy) {}

    async onModuleInit() {
        this.searchEventClient.connect();
        this.logger.log('..:: Connected to Search Queue ::..');
    }

    async productCreated(event: ProductCreatedEvent){
        try {
            this.logger.log(`..:: ${event}, Event is not logging here ::..`);
            await firstValueFrom(
                this.searchEventClient.emit(`product.created`, event)
            )
        } catch (error) {
            this.logger.warn(`..:: Failed to publish product created event ::..`)
        }
    }
}