import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, Prisma } from '@prisma/client';

import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { successResponse } from '../../common/utils/api-response';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateBookingDto) {
    const packageItem = await this.prisma.package.findUnique({
      where: { id: dto.packageId },
    });

    if (!packageItem) {
      throw new NotFoundException('Package not found');
    }

    const booking = await this.prisma.booking.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        adults: dto.adults,
        children: dto.children,
        travelDate: new Date(dto.travelDate),
        notes: dto.notes,
        packageId: dto.packageId,
      },
      include: {
        package: true,
      },
    });

    await this.mailService.sendBookingNotification({
      fullName: booking.fullName,
      email: booking.email ?? undefined,
      phone: booking.phone,
      packageName: booking.package.title,
      travelDate: booking.travelDate.toISOString(),
    });

    return booking;
  }

  async findAll(query: BaseQueryDto & { status?: BookingStatus }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const allowedSortFields = ['createdAt', 'travelDate', 'fullName', 'status'] as const;

    const sort = allowedSortFields.includes(query.sort as any)
      ? query.sort
      : 'createdAt';

    const order = query.order === 'asc' ? 'asc' : 'desc';

    const where: Prisma.BookingWhereInput = {};

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sort]: order,
        },
        include: {
          package: true,
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return successResponse('Bookings fetched successfully', data, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        package: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, dto: UpdateBookingDto) {
    await this.findOne(id);

    return this.prisma.booking.update({
      where: { id },
      data: {
        ...dto,
        travelDate: dto.travelDate ? new Date(dto.travelDate) : undefined,
      },
      include: {
        package: true,
      },
    });
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    const oldBooking = await this.findOne(id);

    const booking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: dto.status,
      },
      include: {
        package: true,
      },
    });

    if (booking.email) {
      await this.mailService.sendBookingStatusEmail(
        booking.email,
        booking.fullName,
        booking.status,
      );
    }

    return booking;
  }
}