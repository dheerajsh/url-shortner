import { Global, Module } from '@nestjs/common'
import { LoggerService } from './logger.service'
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
  providers: [LoggerService],
  imports: [ConfigModule],
  exports: [LoggerService],
})
export class LoggerModule {}
