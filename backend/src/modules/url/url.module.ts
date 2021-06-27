import { LoggerModule } from '@logger/logger.module';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UrlController } from './url.controller';
import { Url } from './url.entity';
import { UrlService } from './url.service';

@Module({
    controllers: [UrlController],
    imports: [
        LoggerModule,
        ConfigModule,
        TypeOrmModule.forFeature([Url]),
        CacheModule.register({
            ttl: 24*60*60, // 1 day
            max: 500, // maximum number of items in cache
        })
    ],
    providers: [UrlService, Repository]
})
export class UrlModule {}
