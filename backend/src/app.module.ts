import { Module } from '@nestjs/common'
import { LoggerModule } from '@logger/logger.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HealthcheckModule } from '@modules/healthcheck/healthcheck.module'
import { UrlModule } from '@modules/url/url.module'
import serverConfig from '@config/server.config'
import dbConfig, { IDatabaseConfig } from '@config/db.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Url } from '@modules/url/url.entity'

@Module({
  imports: [ConfigModule.forRoot({
    load: [serverConfig, dbConfig],
  }),
  LoggerModule,
  HealthcheckModule,
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const conf = configService.get<IDatabaseConfig>('database')

      return ({
        connectTimeoutMS: conf.connectionTimeout,
        database: conf.db,
        entities: [Url],
        host: conf.host,
        maxQueryExecutionTime: conf.queryTimeout,
        password: conf.pass,
        poolSize: conf.poolSize,
        port: conf.port,
        reconnectInterval: conf.reconnectInterval,
        reconnectTries: conf.reconnectTry,
        ssl: false,
        synchronize: false,
        type: 'mongodb',
        username: conf.user,
      })
    },
  }),
  UrlModule],
})
export class AppModule { }
