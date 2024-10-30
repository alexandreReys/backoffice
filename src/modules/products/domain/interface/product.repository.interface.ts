import { CreateProductDto } from '@/modules/products/application/dto/create-product.dto';
import { ProductResponseDto } from '@/modules/products/application/dto/product.response.dto';
import { UpdateProductDto } from '../../application/dto/update-product.dto';

export interface ProductRepositoryInterface {
  create(data: CreateProductDto): Promise<ProductResponseDto>;
  findByName(name: string): Promise<ProductResponseDto[]>;
  findById(id: string): Promise<ProductResponseDto>;
  findAll(params: any, tokenData: any);
  remove(id: string): Promise<void>;
  update(id: string, data: UpdateProductDto): Promise<ProductResponseDto>;
}
