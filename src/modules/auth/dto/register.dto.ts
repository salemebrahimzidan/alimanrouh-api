import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Salem Ebrahim' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'salem@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Admin@123456' })
  @IsString()
  @MinLength(8)
  password!: string;
}