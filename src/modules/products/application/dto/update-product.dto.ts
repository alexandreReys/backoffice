import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from '@/modules/products/application/dto/create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'The name of the product',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;
}
