import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Public } from "../auth/public.decorator";
import { mapRpcErrorToHttp } from "@app/rpc";

@Controller()
export class SearchHttpController {
    constructor(@Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy) {}

    @Get('search')
    @Public()
    async search(@Query('q') q: string, @Query('limit') limit?: number) {
     const limitNo = typeof limit === 'string' && String(limit).trim() ? Number(limit) : undefined;
     try {
        const results = await this.searchClient.send('search.query',{q, limit: limitNo});
        return {
            q,
            count: Array.isArray(results) ? results.length : 0,
            results
        }
     } catch (error) {
        mapRpcErrorToHttp(error)
     }
    }
}