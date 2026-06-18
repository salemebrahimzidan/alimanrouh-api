import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      packages,
      bookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      messages,
      unreadMessages,
      users,
      latestBookings,
      latestMessages,
    ] = await Promise.all([
      this.prisma.package.count(),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'PENDING' } }),
      this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.booking.count({ where: { status: 'CANCELLED' } }),
      this.prisma.contactMessage.count(),
      this.prisma.contactMessage.count({ where: { isRead: false } }),
      this.prisma.user.count(),

      this.prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { package: true },
      }),

      this.prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      counts: {
        packages,
        bookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        messages,
        unreadMessages,
        users,
      },
      latestBookings,
      latestMessages,
    };
  }
}