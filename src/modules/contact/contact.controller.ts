
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Public (Website)
  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  // Admin
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query()
    query: BaseQueryDto & {
      isRead?: boolean;
    },
  ) {
    return this.contactService.findAll(query);
  }

  // Admin
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  // Admin
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
