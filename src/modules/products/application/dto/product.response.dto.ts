import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'The id of the product',
    example: '0b38bf86-9f97-4417-8b7c-5113a40d4270',
  })
  id: string;

  @ApiProperty({
    description: 'The BranchId of the product',
    example: '0b38bf86-9f97-4417-8b7c-5113a40d4270',
    required: true,
  })
  branchId: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'John Doe',
  })
  name: string;
}
