import { ApiProperty } from '@nestjs/swagger';

export class BranchResponseDto {
  @ApiProperty({
    description: 'The id of the branchUser',
    example: '0b38bf86-9f97-4417-8b7c-5113a40d4270',
  })
  id: string;

  @ApiProperty({
    description: 'The userId of the branchUser',
    example: '0b38bf86-9f97-4417-8b7c-5113a40d4270',
    required: true,
  })
  userId: string;

  @ApiProperty({
    description: 'The branchId of the branchUser',
    example: 'John Doe',
  })
  branchId: string;
}
