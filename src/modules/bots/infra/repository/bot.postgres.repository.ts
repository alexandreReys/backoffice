import { PrismaService } from '@/infra/database/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BotResponseDto } from '../../application/dto/bot.response.dto';
import { CreateBotDto } from '../../application/dto/create-bot.dto';
import { BotRepositoryInterface } from '../../domain/interface/bot.repository.interface';
import { Prisma } from '@prisma/client';
import { UpdateBotDto } from '../../application/dto/update-bot.dto';

@Injectable()
export class BotPostgresRepository implements BotRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateBotDto): Promise<BotResponseDto> {
    const newBot = await this.prismaService.bot.create({
      data: {
        branchId: data.branchId,
        name: data.name,
      },
      select: {
        id: true,
        branchId: true,
        name: true,
      },
    });

    return newBot;
  }

  async findByName(name: string): Promise<BotResponseDto[]> {
    name = name.toLowerCase().trim();

    const bots = await this.prismaService.bot.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        branchId: true,
        name: true,
      },
    });

    return bots;
  }

  async findById(id: string): Promise<BotResponseDto> {
    const bot = await this.prismaService.bot.findUnique({
      where: { id },
      select: {
        id: true,
        branchId: true,
        name: true,
      },
    });

    if (!bot) {
      return null;
    }

    return bot;
  }

  async findAll(params: any): Promise<any> {
    const { page = 1, limit = 10, name } = params;
    const skip = (page - 1) * limit;
    const filters: Prisma.BotWhereInput = {};

    if (name) {
      filters.name = { contains: name, mode: 'insensitive' };
    }

    const [bots, botsCount] = await this.prismaService.$transaction([
      this.prismaService.bot.findMany({
        where: filters,
        skip,
        take: parseInt(limit as any, 10),
        select: {
          id: true,
          branchId: true,
          name: true,
        },
      }),
      this.prismaService.bot.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(botsCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      result: {
        bots,
        meta: {
          hasNextPage,
          hasPreviousPage,
        },
      },
    };
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.bot.delete({ where: { id } });
      return;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Deletion denied! Operation refused due to foreign key relationship',
          );
        }
      }
      throw new Error('Error deleting bot');
    }
  }

  async update(id: string, data: UpdateBotDto): Promise<BotResponseDto> {
    const bot = await this.prismaService.bot.findUnique({
      where: { id },
    });

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    const updatedBot = await this.prismaService.bot
      .update({
        where: { id },
        data,
        select: {
          id: true,
          branchId: true,
          name: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Bot not found');
      });

    return updatedBot;
  }
}
