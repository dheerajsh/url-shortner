
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsDate, IsDateString, IsDefined, IsOptional, IsUrl } from 'class-validator'

export class urlCreateDto {

  @ApiProperty({
    type: 'string',
  })

  @IsDefined()
  @IsUrl({require_protocol:true, host_blacklist: ['']}, {message: 'Invalid or blacklisted url'})
  readonly originalUrl: string

  @ApiPropertyOptional({
    type: 'string',
  })

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ type: String, description: 'as UTCDate ex. 2022-01-19T12:26:51.000Z' })
  readonly expiryDate?: Date

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsOptional()
  readonly userId: string


}
