import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { SortOrder } from './url.types'

export class UrlFilterInput {

  @ApiProperty({
    description: 'offset record number for pagination, default is 0',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => {
    return Number
  })
  readonly offset: number = 0 // eslint-disable-line no-magic-numbers

  @ApiProperty({
    description: 'limit number of records for pagination, default is 10',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => {
    return Number
  })
  readonly limit: number = 10 // eslint-disable-line no-magic-numbers

  @ApiProperty({
    description: 'keywords to be filter on original urls',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  @Type(() => {
    return String
  })
  readonly keywords: readonly string[]

  @ApiProperty({
    description: 'Sort by expiry date',
    required: false,
    type: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'expiration date order must be one of ASC or DESC' })
  readonly orderByExpirationDate: SortOrder


  @ApiProperty({
    description: 'Sort by hits rate',
    required: false,
    type: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder, {message : 'hits order must be one of ASC or DESC'})
  readonly orderbyHits: SortOrder
}

