import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get('health-check')
  healthCheck() {
    return {
      ok: true,
      service: 'Gateway',
      now: new Date().toLocaleDateString(),
    };
  }
}
