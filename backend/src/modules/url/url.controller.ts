
import { LoggerService } from '@logger/logger.service'
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common'
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Logger } from 'winston'
import { UrlCreateDto } from './url.create.dto'
import { Url } from './url.entity'
import { UrlFilterInput } from './url.filter.input'
import { UrlService } from './url.service'

@ApiTags('Url Api\'s')
@Controller()
export class UrlController {

  private readonly logger: Logger
  constructor(private readonly loggerService: LoggerService,
              private readonly urlService: UrlService) {
    this.logger = this.loggerService.getLogger(UrlController.name)
  }

  /**
     * Visiting the Shortened URLs redirect to the original URL with a HTTP 302 redirect
     * Expired URLs return HTTP 410
     * Hit counter for shortened URLs (increment with every hit)
     */
  @Get(':id')
  @ApiParam({ description: 'short url that was generated from this app',name: 'id', required: true,  type: String})
  @ApiResponse({ description: 'Original url found', status: HttpStatus.FOUND })
  @ApiResponse({ description: 'Original url is either expired or deleted', status: HttpStatus.GONE })
  @ApiResponse({ description: 'Original url not found',  status: HttpStatus.NOT_FOUND })
  @ApiResponse({ description: 'Empty or null short url',  status: HttpStatus.BAD_REQUEST })
  @HttpCode(HttpStatus.FOUND)
  @HttpCode(HttpStatus.NOT_FOUND)
  public async visitShortUrl(@Param('id') id: string, @Res() res: Response): Promise<void> {

    if (!id) {
      throw new BadRequestException('Short url is mendatory')
    }
    const url = await this.urlService.find(id)
    if (!url) {
      throw new NotFoundException('No corrosponding url found.')
    } else {
      await this.urlService.increamentHits(url)
      if (url.isExpired()) {
        res.status(HttpStatus.GONE).send('requested url is expired')
      }
      res.status(HttpStatus.FOUND).redirect(url.originalUrl)
    }
  }

  /**
     * Find all the urls for the given search params
     * Accessible only for Admins
     */
  @Get()
  @ApiResponse({ description: 'urls found', status: HttpStatus.OK })
  @ApiResponse({ description: 'No urls found for matching criteria', status: HttpStatus.NOT_FOUND })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)

  public async findUrls(
    @Query(new ValidationPipe({ transform: true })) filter: UrlFilterInput,
  ): Promise<readonly [readonly Url[], number]> {

    const urls = await this.urlService.findAll(filter)

    if (!urls) {
      throw new NotFoundException('No urls for found for matching search criteria')
    }

    return urls
  }
  /**
     * Validate and Create a url object in the system if.
     * Validate happen with the help of validationPipe and is defined on urlCreateDto itself
     * @param input urlCreateDto
     * @returns
     */
  @Post()
  @ApiResponse({ description: 'Short url created.', status: HttpStatus.CREATED })
  @ApiResponse({ description: 'Invalid Url or expiry date', status: HttpStatus.BAD_REQUEST })
  @ApiBody({ type: UrlCreateDto })
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async createUrl(@Body() input: UrlCreateDto): Promise<string> {

    // create short url and save into DB
    try {

      return await this.urlService.createUrl(input.originalUrl, input.userId, input.expiryDate)
    } catch (error) {
      this.logger.error('Error occured while creating a new short url')
      throw new InternalServerErrorException('Error occured while creating a new short url.')
    }
  }

  /**
     * Marks the url as deleted
     * @param id The ID of the record, not the short Url
     */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @ApiParam({ description: 'The short url', name: 'id', required: true, type: String})
  @ApiResponse({description: 'Success', status: HttpStatus.OK })
  @ApiResponse({ description: 'Url not found', status: HttpStatus.NOT_FOUND })
  @ApiResponse({ description: 'Empty id', status: HttpStatus.BAD_REQUEST })
  public async deleteUrl(@Param('id') id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('Short url is mendatory')
    }
    const updateResult = await this.urlService.delete(id)

    if (!updateResult) {
      throw new NotFoundException(`${id} not found for deletion`)
    }
  }
}
