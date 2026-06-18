import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Ahmed Mohamed' })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'ahmed@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+966501234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Umrah Inquiry', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ example: 'I would like to know the available Umrah packages.' })
  @IsString()
  @MaxLength(2000)
  message!: string;
}