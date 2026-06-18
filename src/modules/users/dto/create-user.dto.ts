import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'Salem Ebrahim' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'admin@alimanrouh.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Admin@123456' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}