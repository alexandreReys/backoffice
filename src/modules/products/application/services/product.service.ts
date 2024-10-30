import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '@/modules/products/application/dto/create-product.dto';
import { UpdateProductDto } from '@/modules/products/application/dto/update-product.dto';
import { ProductResponseDto } from '../dto/product.response.dto';
import { ProductRepositoryInterface } from '../../domain/interface/product.repository.interface';
import { RequestContextService } from '@/modules/request-context/request-context.service';
import { BranchService } from '@/modules/branches/application/services/branch.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly requestContextService: RequestContextService,
    private readonly branchService: BranchService,
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,
  ) {}

  async create(data: CreateProductDto): Promise<ProductResponseDto> {
    const existingBranch = await this.branchService.findById(data.branchId);
    if (!existingBranch) {
      throw new NotFoundException('Branch not found');
    }

    const product = this.productRepository.create(data);
    return product;
  }

  async findAll(params: any, tokenData: any) {
    return await this.productRepository.findAll(params, tokenData);
  }

  async findById(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findByName(email: string) {
    const product = await this.productRepository.findByName(email);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async remove(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.remove(id);

    return;
  }

  async update(id: string, data: UpdateProductDto) {
    let product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product = await this.productRepository.update(id, data);

    return product;
  }
}
