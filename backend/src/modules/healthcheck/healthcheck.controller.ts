import { Request } from 'express'

import { LoggerService } from '@logger/logger.service'
import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Logger } from 'winston'

@ApiTags('Healthcheck')
@Controller('healthcheck')
export class HealthcheckController {

  private readonly logger: Logger
  constructor(private readonly loggerService: LoggerService) {
    this.logger = this.loggerService.getLogger(HealthcheckController.name)
  }

  @Get()
  @ApiResponse({status: HttpStatus.OK, description: 'Application is running'})
  @HttpCode(HttpStatus.OK)
  public async get(@Req() request: Request): Promise<HealthcheckResponse> {
    this.logger.info(`Request.headers: ${JSON.stringify(request.headers)}`)

    return {
      status: 'OK',
      player: {
        status: 'UP',
      },
    }
  }
}

export interface HealthcheckResponse {
  readonly status: 'OK' | 'CRITICAL'
  readonly player: Health
}
export interface Health {
  readonly status: 'UP' | 'DOWN'
}
