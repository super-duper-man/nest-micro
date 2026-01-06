import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductEventsDto } from './searchEvent/product-events.dto';
import { SearchQueryDto } from './searchEvent/search-query.dto';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @EventPattern('product.created')
  async onProductCreated(@Payload() payload: ProductEventsDto) {
    console.log(payload);

    await this.searchService.upsertFromCatalogEvent(payload);

  }

  @MessagePattern('search.query')
  async query(@Payload() payload: SearchQueryDto){
    return this.searchService.query(payload);
  }

  @MessagePattern('service.ping')
  ping() {
    return this.searchService.ping();
  }
}
