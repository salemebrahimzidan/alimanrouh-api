import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'Ahmed Mohamed' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: '+966501234567' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'ahmed@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  adults!: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  children!: number;

  @ApiProperty({ example: '2026-07-20T00:00:00.000Z' })
  @IsDateString()
  travelDate!: string;

  @ApiProperty({ example: 'Need 5-star hotel', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'PACKAGE_ID_HERE' })
  @IsUUID()
  packageId!: string;
}