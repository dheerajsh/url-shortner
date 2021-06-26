import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { SortOrder } from "./url.types";

export class UrlFilterInput {

  @ApiProperty({ type: Number, description: 'offset record number for pagination, default is 0', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly offset: number = 0

  @ApiProperty({ type: Number, description: 'limit number of records for pagination, default is 10', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly limit: number = 10

  @ApiProperty({ type: [String], description: 'keywords to be filter on original urls', required: false })
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  readonly keywords: string[];

  @ApiProperty({ type: SortOrder, description: 'Sort by expiry date', required: false })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'expiration date order must be one of ASC or DESC' })
  readonly orderByExpirationDate: SortOrder


  @ApiProperty({ type: SortOrder, description: 'Sort by hits rate', required: false })
  @IsOptional()
  @IsEnum(SortOrder, {message : 'hits order must be one of ASC or DESC'})
  readonly orderbyHits: SortOrder;
}

