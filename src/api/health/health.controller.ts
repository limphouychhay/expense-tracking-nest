import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('health')
export class HealthController {
  @Get()
  check(@Res() response: Response) {
    const isHealthy = true;

    if (isHealthy) {
      response.status(200).json({ status: 'ok' });
    } else {
      response.status(503).json({ status: 'down' });
    }
  }
}
