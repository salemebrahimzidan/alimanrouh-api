import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'salem@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Admin@123456' })
  @IsString()
  password!: string;
}