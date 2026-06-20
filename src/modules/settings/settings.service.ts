import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await this.prisma.siteSettings.create({
        data: {
          siteName: 'Al Iman Rouh',
          email: 'info@alimanrouh.com',
          phone: '',
          whatsapp: '',
          address: '',
          facebook: '',
          instagram: '',
          youtube: '',
          twitter: '',
          logo: '',
          heroImage: '',
        },
      });
    }

    return settings;
  }

  async updateSettings(dto: any) {
    const settings = await this.getSettings();

    return this.prisma.siteSettings.update({
      where: {
        id: settings.id,
      },
      data: dto,
    });
  }
}