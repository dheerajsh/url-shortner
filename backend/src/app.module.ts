import { Module } from '@nestjs/common'
import { LoggerModule } from '@logger/logger.module'
import { ConfigModule } from '@nestjs/config'
import { HealthcheckModule } from '@modules/healthcheck/healthcheck.module'
import serverConfig from '@config/server.config'

@Module({
  imports: [ConfigModule.forRoot({
    load: [serverConfig],
  }),
  LoggerModule,
  HealthcheckModule],
})
export class AppModule {}
