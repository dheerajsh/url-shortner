import { Global, Module } from '@nestjs/common'
import { LoggerService } from './logger.service'
import { ConfigModule } from '@nestjs/config'

@Global()
@Module({
  exports: [LoggerService],
  imports: [ConfigModule],
  providers: [LoggerService],
})
export class LoggerModule {}
