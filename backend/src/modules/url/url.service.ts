
import { LoggerService } from '@logger/logger.service'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { plainToClass } from 'class-transformer'
import { createHash } from 'crypto'
import { FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm'
import { Logger } from 'winston'
import { Url } from './url.entity'
import { UrlFilterInput } from './url.filter.input'
import { Status } from './url.types'
import { createUniqueShortKey } from './url.utils'

@Injectable()
export class UrlService {

  private readonly logger: Logger
  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(Url) private readonly urlRepository: Repository<Url>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {

    this.logger = this.loggerService.getLogger(UrlService.name)
  }

  /**
     * Find the original url from givne short url
     * @param id short url i.e id of the original url
     * @returns The Url object if found or null if not found.
     */
  public async find(id: string): Promise<Url | undefined> {
    this.logger.info(`Got lookup request for short url : ${id}`)
    const fromCache = await this.cacheManager.get<Url>(id)

    if (fromCache) {
      this.logger.info(`Find in cache for short url: ${id}`)

      return fromCache
    }

    this.logger.info(`Not found in cache for short url: ${id}, finding in the DB`)
    const find: FindOneOptions = { where: { id } }
    const url = await this.urlRepository.findOne(find)
    url && await this.cacheManager.set(url.id, url)

    return url
  }

  /**
     *  Find all the original url from given filters and sort order
     * @param input {
     *  offset: start value defualt is 0 for pagination
     *  limit:  limit of records to be search, default is 10
     *  keywords: optional keywords to filter on original urls
     *  sort: sorting order, supports expiration date, hits or both
     * }
     *
     * @returns List of matchin urls
     */
  public async findAll(input: UrlFilterInput): Promise<readonly [readonly Url[], number]> {
    this.logger.info('searching for original Urls for given filters')
    const { keywords, limit, offset, orderByExpirationDate, orderbyHits } = input
    const findOptions: FindManyOptions = {
      take: limit,
      skip: offset,
    }
    // filter for keywords if any
    if (keywords) {
      // join if there are multiple keywords else not.
      const regexText = Array.isArray(keywords)? keywords.join('|') : keywords
      findOptions.where = { originalUrl : new RegExp(`^.*(${regexText}).*$`)} // eslint-disable-line functional/immutable-data

    }
    // Apply sort order if any
    if (orderByExpirationDate) {
      findOptions.order = { expirationDate: orderByExpirationDate } // eslint-disable-line functional/immutable-data
    }

    if (orderbyHits) {
      findOptions.order = { ...findOptions.order, hits: orderbyHits } // eslint-disable-line functional/immutable-data
    }

    return this.urlRepository.findAndCount(findOptions)
  }
  /**
     * Increament the hits count value by 1.
     * @param url Url object
     * @returns Updated result, this can be used to check the status or update.
     */
  public async increamentHits(url: Url): Promise<UpdateResult> {
    this.logger.info(`Increamenting hits count for url id : ${url.id}`)
    const updatedUrl = plainToClass(Url, {
      ...url,
      hits: url.hits+1,
    })

    return this.urlRepository.update(updatedUrl._id, updatedUrl) // eslint-disable-line no-underscore-dangle
  }
  /**
     * Create a short url for the given url and save it.
     * @param originalUrl Original URl
     * @param expireDate expiry date of the url
     * @returns short url
     */
  public async createUrl(originalUrl: string, userId: string,  expireDate?: Date): Promise<string> {
    // save into DB
    const newUrl = plainToClass(Url, {
      expirationDate: expireDate || null,
      originalUrl,
      userId,
    })
    const result = await this.urlRepository.insert(newUrl)

    // create short url
    if (result.identifiers.length > 0 && newUrl.id == null) {
      // eslint-disable-next-line no-underscore-dangle
      const shortKey = await createUniqueShortKey(newUrl.originalUrl, newUrl._id.toString())
      const updatedUrl = plainToClass(Url, { ...newUrl, id: shortKey })
      await this.urlRepository.update(updatedUrl._id, updatedUrl) // eslint-disable-line no-underscore-dangle
      this.logger.info(`A unique short key is generated for url: ${originalUrl}`)

      return updatedUrl.id
    }

  }
  /**
     * Find the original url from givne short url and mark it as deleted
     * @param id short url i.e id of the original url
     * @returns Updated result, this can be used to check the status or update.
     */
  public async delete(id: string): Promise<UpdateResult | undefined> {
    const url = await this.find(id)

    if (!url) {
      return undefined
    }

    const updatedUrl = plainToClass(Url, {
      ...url,
      status: Status.DELETED,
    })
    await this.cacheManager.del(url.id) // remove from cache if was cached

    return this.urlRepository.update(url._id, updatedUrl) // eslint-disable-line no-underscore-dangle
  }

}
