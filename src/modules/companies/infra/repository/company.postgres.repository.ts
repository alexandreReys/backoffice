import { PrismaService } from '@/infra/database/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompanyResponseDto } from '../../application/dto/company.response.dto';
import { CreateCompanyDto } from '../../application/dto/create-company.dto';
import { CompanyRepositoryInterface } from '../../domain/interface/company.repository.interface';
import { Prisma } from '@prisma/client';
import { UpdateCompanyDto } from '../../application/dto/update-company.dto';

@Injectable()
export class CompanyPostgresRepository implements CompanyRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateCompanyDto): Promise<CompanyResponseDto> {
    const newCompany = await this.prismaService.company.create({
      data: {
        name: data.name,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return newCompany;
  }

  async findByName(name: string): Promise<CompanyResponseDto[]> {
    name = name.toLowerCase().trim();

    const companies = await this.prismaService.company.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return companies;
  }

  async findById(id: string): Promise<CompanyResponseDto> {
    const company = await this.prismaService.company.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!company) {
      return null;
    }

    return company;
  }

  async findAll(params: any): Promise<any> {
    const { page = 1, limit = 10, name } = params;
    const skip = (page - 1) * limit;
    const filters: Prisma.CompanyWhereInput = {};

    if (name) {
      filters.name = { contains: name, mode: 'insensitive' };
    }

    const [companies, companiesCount] = await this.prismaService.$transaction([
      this.prismaService.company.findMany({
        where: filters,
        skip,
        take: parseInt(limit as any, 10),
        select: {
          id: true,
          name: true,
        },
      }),
      this.prismaService.company.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(companiesCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      result: {
        companies,
        meta: {
          hasNextPage,
          hasPreviousPage,
        },
      },
    };
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.company.delete({ where: { id } });
      return;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Deletion denied! Operation refused due to foreign key relationship',
          );
        }
      }
      throw new Error('Error deleting company');
    }
  }

  async update(
    id: string,
    data: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    const company = await this.prismaService.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const updatedCompany = await this.prismaService.company
      .update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Company not found');
      });

    return updatedCompany;
  }
}
