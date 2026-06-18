import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BaseQueryDto } from '../../common/dto/base-query.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@ApiTags('Packages')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'price'],
      properties: {
        title: { type: 'string', example: 'Premium Umrah Package' },
        description: {
          type: 'string',
          example: '7 nights in Makkah and Madinah',
        },
        price: { type: 'number', example: 2500 },
        duration: { type: 'number', example: 7 },
        isActive: { type: 'boolean', example: true },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/packages',
        filename: (_, file, callback) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);

          callback(null, uniqueName);
        },
      }),
    }),
  )
  create(
    @Body() dto: CreatePackageDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.packagesService.create(dto, file);
  }

  @Get()
findAll(@Query() query: BaseQueryDto) {
  return this.packagesService.findAll(query as any);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.packagesService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }
}