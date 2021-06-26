import { Module } from '@nestjs/common'
import { LoggerModule } from '@logger/logger.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HealthcheckModule } from '@modules/healthcheck/healthcheck.module'
import { UrlModule } from '@modules/url/url.module';
import serverConfig from '@config/server.config'
import dbConfig, { IDatabaseConfig } from '@config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from '@modules/url/url.entity';

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
        type: 'mongodb',
        host: conf.host,
        port: conf.port,
        username: conf.user,
        password: conf.pass,
        database: conf.db,
        maxQueryExecutionTime: conf.queryTimeout,
        connectTimeoutMS: conf.connectionTimeout,
        reconnectInterval: conf.reconnectInterval,
        reconnectTries: conf.reconnectTry,
        poolSize: conf.poolSize,
        ssl: false,
        synchronize: false,
        entities: [Url],
      })
    }
  }),
  UrlModule],
})
export class AppModule { }
