import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { successResponse } from '../../common/utils/api-response';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateContactDto) {
    const message = await this.prisma.contactMessage.create({
      data: dto,
    });

    await this.mailService.sendContactNotification({
      name: message.name,
      email: message.email,
      phone: message.phone ?? undefined,
      subject: message.subject ?? undefined,
      message: message.message,
    });

    return message;
  }

  async findAll(
    query: BaseQueryDto & {
      isRead?: boolean;
    },
  ) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;
  
    const allowedSortFields = ['createdAt', 'name', 'email'] as const;
  
    const sort = allowedSortFields.includes(query?.sort as any)
      ? query.sort
      : 'createdAt';
  
    const order = query?.order === 'asc' ? 'asc' : 'desc';
  
    const where: Prisma.ContactMessageWhereInput = {};
  
    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
      ];
    }
  
    if (query?.isRead !== undefined) {
      where.isRead = query.isRead;
    }
  
    const [data, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sort as string]: order,
        },
      }),
      this.prisma.contactMessage.count({ where }),
    ]);
  
    return successResponse('Messages fetched successfully', data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }
  async markAsRead(id: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}