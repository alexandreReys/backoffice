import { PrismaService } from '@/infra/database/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BranchResponseDto } from '../../application/dto/branch.response.dto';
import { CreateBranchDto } from '../../application/dto/create-branch.dto';
import { BranchRepositoryInterface } from '../../domain/interface/branch.repository.interface';
import { Prisma } from '@prisma/client';
import { UpdateBranchDto } from '../../application/dto/update-branch.dto';

@Injectable()
export class BranchPostgresRepository implements BranchRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateBranchDto): Promise<BranchResponseDto> {
    const newBranch = await this.prismaService.branch.create({
      data: {
        companyId: data.companyId,
        name: data.name,
      },
      select: {
        id: true,
        companyId: true,
        name: true,
      },
    });

    return newBranch;
  }

  async findByName(name: string): Promise<BranchResponseDto[]> {
    name = name.toLowerCase().trim();

    const branches = await this.prismaService.branch.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        companyId: true,
        name: true,
      },
    });

    return branches;
  }

  async findById(id: string): Promise<BranchResponseDto> {
    const branch = await this.prismaService.branch.findUnique({
      where: { id },
      select: {
        id: true,
        companyId: true,
        name: true,
      },
    });

    if (!branch) {
      return null;
    }

    return branch;
  }

  async findAll(params: any): Promise<any> {
    const { page = 1, limit = 10, name } = params;
    const skip = (page - 1) * limit;
    const filters: Prisma.BranchWhereInput = {};

    if (name) {
      filters.name = { contains: name, mode: 'insensitive' };
    }

    const [branches, branchesCount] = await this.prismaService.$transaction([
      this.prismaService.branch.findMany({
        where: filters,
        skip,
        take: parseInt(limit as any, 10),
        select: {
          id: true,
          companyId: true,
          name: true,
        },
      }),
      this.prismaService.branch.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(branchesCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      result: {
        branches,
        meta: {
          hasNextPage,
          hasPreviousPage,
        },
      },
    };
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.branch.delete({ where: { id } });
      return;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Deletion denied! Operation refused due to foreign key relationship',
          );
        }
      }
      throw new Error('Error deleting branch');
    }
  }

  async update(id: string, data: UpdateBranchDto): Promise<BranchResponseDto> {
    const branch = await this.prismaService.branch.findUnique({
      where: { id },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    const updatedBranch = await this.prismaService.branch
      .update({
        where: { id },
        data,
        select: {
          id: true,
          companyId: true,
          name: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Branch not found');
      });

    return updatedBranch;
  }
}
