import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private excludePassword<T extends { password?: string }>(user: T) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      },
    });

    return this.excludePassword(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.excludePassword(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const data = {
      ...dto,
      password: dto.password ? await bcrypt.hash(dto.password, 10) : undefined,
    };

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.excludePassword(user);
  }

  async remove(id: string) {
    await this.findOne(id);

    const user = await this.prisma.user.delete({
      where: { id },
    });

    return this.excludePassword(user);
  }
}