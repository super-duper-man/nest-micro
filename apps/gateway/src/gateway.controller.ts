import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Public } from './auth/public.decorator';

@Controller()
export class GatewayController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClientProxy: ClientProxy,
    @Inject('SEARCH_CLIENT') private readonly searchClientProxy: ClientProxy,
    @Inject('MEDIA_CLIENT') private readonly mediaClientProxy: ClientProxy,
  ) { }

  @Get('health-check')
  @Public()
  async healthCheck() {
    const ping = async (serviceName: string, client: ClientProxy) => {
      try {
        const result = await firstValueFrom(
          client.send('service.ping', { from: 'gateway' })
        );
        return {
          ok: true,
          service: serviceName,
          result
        };
      } catch (err: any) {
        return {
          ok: false,
          error: err?.message ?? "Unknown Error"
        };
      }
    };

    const [catalog, search, media] = await Promise.all([
      ping('catalog', this.catalogClientProxy),
      ping('search', this.searchClientProxy),
      ping('media', this.mediaClientProxy),
    ]);

    const ok = [catalog, media, search].every(s => s.ok);

    return {
      ok,
      gateway: {
        service: 'gateway',
        now: new Date().toLocaleDateString()
      },
      services: {
        catalog,
        media,
        search
      }
    };
  }
}
