import { ApiProperty } from '@nestjs/swagger';

export class BranchResponseDto {
  @ApiProperty({
    description: 'The id of the branch',
    example: '0b38bf86-9f97-4417-8b7c-5113a40d4270',
  })
  id: string;

  @ApiProperty({
    description: 'The CompanyId of the branch',
    example: '0b38bf86-9f97-4417-8b7c-5113a40d4270',
    required: true,
  })
  companyId: string;

  @ApiProperty({
    description: 'The name of the branch',
    example: 'John Doe',
  })
  name: string;
}
