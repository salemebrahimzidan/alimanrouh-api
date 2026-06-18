import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseQueryDto } from '../../common/dto/base-query.dto';
import { successResponse } from '../../common/utils/api-response';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePackageDto, file?: Express.Multer.File) {
    return this.prisma.package.create({
      data: {
        title: data.title,
        description: data.description ?? '',
        price: data.price,
        duration: data.duration,
        isActive: data.isActive ?? true,
        imageUrl: file ? `/uploads/packages/${file.filename}` : null,
      },
    });
  }

  async findAll(query: BaseQueryDto) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;

    const allowedSortFields = ['createdAt', 'title', 'price', 'duration'] as const;
    const sort = allowedSortFields.includes(query?.sort as any)
      ? query?.sort
      : 'createdAt';

    const order = query?.order === 'asc' ? 'asc' : 'desc';

    const where: Prisma.PackageWhereInput = {};

    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [data, total] = await Promise.all([
      this.prisma.package.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sort as string]: order,
        },
      }),
      this.prisma.package.count({ where }),
    ]);

    return successResponse(
      'Packages fetched successfully',
      data,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    );
  }

  async findOne(id: string) {
    const item = await this.prisma.package.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Package not found');
    }

    return item;
  }

  update(id: string, data: UpdatePackageDto) {
    return this.prisma.package.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.package.delete({
      where: { id },
    });
  }
}