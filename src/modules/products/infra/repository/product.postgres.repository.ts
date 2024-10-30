import { PrismaService } from '@/infra/database/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductResponseDto } from '../../application/dto/product.response.dto';
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { ProductRepositoryInterface } from '../../domain/interface/product.repository.interface';
import { Prisma } from '@prisma/client';
import { UpdateProductDto } from '../../application/dto/update-product.dto';

@Injectable()
export class ProductPostgresRepository implements ProductRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateProductDto): Promise<ProductResponseDto> {
    const newProduct = await this.prismaService.product.create({
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

    return newProduct;
  }

  async findByName(name: string): Promise<ProductResponseDto[]> {
    name = name.toLowerCase().trim();

    const products = await this.prismaService.product.findMany({
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

    return products;
  }

  async findById(id: string): Promise<ProductResponseDto> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      select: {
        id: true,
        branchId: true,
        name: true,
      },
    });

    if (!product) {
      return null;
    }

    return product;
  }

  async findAll(params: any): Promise<any> {
    const { page = 1, limit = 10, name } = params;
    const skip = (page - 1) * limit;
    const filters: Prisma.ProductWhereInput = {};

    if (name) {
      filters.name = { contains: name, mode: 'insensitive' };
    }

    const [products, productsCount] = await this.prismaService.$transaction([
      this.prismaService.product.findMany({
        where: filters,
        skip,
        take: parseInt(limit as any, 10),
        select: {
          id: true,
          branchId: true,
          name: true,
        },
      }),
      this.prismaService.product.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(productsCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      result: {
        products,
        meta: {
          hasNextPage,
          hasPreviousPage,
        },
      },
    };
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.product.delete({ where: { id } });
      return;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Deletion denied! Operation refused due to foreign key relationship',
          );
        }
      }
      throw new Error('Error deleting product');
    }
  }

  async update(
    id: string,
    data: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = await this.prismaService.product
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
        throw new NotFoundException('Product not found');
      });

    return updatedProduct;
  }
}
