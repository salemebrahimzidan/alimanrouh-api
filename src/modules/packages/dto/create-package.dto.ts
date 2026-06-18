import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePackageDto {
  @ApiProperty({
    example: 'Premium Umrah Package',
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: '7 nights in Makkah and Madinah',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    example: 2500,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 7,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  duration?: number;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}