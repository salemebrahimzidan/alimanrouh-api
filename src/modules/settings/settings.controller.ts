import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        siteName: { type: 'string', example: 'Al Iman Rouh Travel' },
        email: { type: 'string', example: 'info@alimanrouh.com' },
        phone: { type: 'string', example: '+966509073698' },
        whatsapp: { type: 'string', example: '+966509073698' },
        address: { type: 'string', example: 'Makkah, Saudi Arabia' },
        facebook: { type: 'string', example: 'https://facebook.com/alimanrouh' },
        instagram: { type: 'string', example: 'https://instagram.com/alimanrouh' },
        youtube: { type: 'string', example: 'https://youtube.com/@alimanrouh' },
        twitter: { type: 'string', example: 'https://x.com/alimanrouh' },
        logo: { type: 'string', example: '' },
        heroImage: { type: 'string', example: '' },
      },
    },
  })
  updateSettings(@Body() dto: any) {
    return this.settingsService.updateSettings(dto);
  }
}