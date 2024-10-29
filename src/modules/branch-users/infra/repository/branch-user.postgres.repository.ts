import { PrismaService } from '@/infra/database/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BranchResponseDto } from '../../application/dto/branch-user.response.dto';
import { CreateBranchDto } from '../../application/dto/create-branch-user.dto';
import { BranchUserRepositoryInterface } from '../../domain/interface/branch-user.repository.interface';
import { Prisma } from '@prisma/client';
import { UpdateBranchDto } from '../../application/dto/update-branch-user.dto';

@Injectable()
export class BranchUserPostgresRepository
  implements BranchUserRepositoryInterface
{
  constructor(private prismaService: PrismaService) {}
  async create(data: CreateBranchDto): Promise<BranchResponseDto> {
    const newBranch = await this.prismaService.branchUser.create({
      data: {
        userId: data.userId,
        branchId: data.branchId,
      },
      select: {
        id: true,
        userId: true,
        branchId: true,
      },
    });

    return newBranch;
  }

  async findById(id: string): Promise<BranchResponseDto> {
    const branchUser = await this.prismaService.branchUser.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        branchId: true,
      },
    });

    if (!branchUser) {
      return null;
    }

    return branchUser;
  }

  async findByBranch(params: any): Promise<any> {
    const { page = 1, limit = 10, branchId } = params;
    const skip = (page - 1) * limit;

    const filters: Prisma.BranchUserWhereInput = {
      branchId,
    };

    const [branchUsers, branchUsersCount] =
      await this.prismaService.$transaction([
        this.prismaService.branchUser.findMany({
          where: filters,
          skip,
          take: parseInt(limit as any, 10),
          select: {
            id: true,
            userId: true,
            branchId: true,
          },
        }),
        this.prismaService.branchUser.count({
          where: filters,
        }),
      ]);

    const totalPages = Math.ceil(branchUsersCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      result: branchUsers,
      meta: {
        page,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        totalCount: branchUsersCount,
      },
    };
  }

  async findByBranchUser(
    branchId: string,
    userId: string,
  ): Promise<BranchResponseDto> {
    const branchUser = await this.prismaService.branchUser.findFirst({
      where: {
        branchId,
        userId,
      },
      select: {
        id: true,
        userId: true,
        branchId: true,
      },
    });

    return branchUser;
  }

  async findAll(params: any): Promise<any> {
    const { page = 1, limit = 10, branchId } = params;
    const skip = (page - 1) * limit;
    const filters: Prisma.BranchUserWhereInput = {};

    if (branchId) {
      filters.branchId = { contains: branchId, mode: 'insensitive' };
    }

    const [branchUsers, branchUsersCount] =
      await this.prismaService.$transaction([
        this.prismaService.branchUser.findMany({
          where: filters,
          skip,
          take: parseInt(limit as any, 10),
          select: {
            id: true,
            userId: true,
            branchId: true,
          },
        }),
        this.prismaService.branchUser.count({
          where: filters,
        }),
      ]);

    const totalPages = Math.ceil(branchUsersCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      result: {
        branchUsers,
        meta: {
          hasNextPage,
          hasPreviousPage,
        },
      },
    };
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.branchUser.delete({ where: { id } });
      return;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Deletion denied! Operation refused due to foreign key relationship',
          );
        }
      }
      throw new Error('Error deleting branchUser');
    }
  }

  async update(id: string, data: UpdateBranchDto): Promise<BranchResponseDto> {
    const branchUser = await this.prismaService.branchUser.findUnique({
      where: { id },
    });

    if (!branchUser) {
      throw new NotFoundException('BranchUser not found');
    }

    const updatedBranch = await this.prismaService.branchUser
      .update({
        where: { id },
        data,
        select: {
          id: true,
          userId: true,
          branchId: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('BranchUser not found');
      });

    return updatedBranch;
  }
}
