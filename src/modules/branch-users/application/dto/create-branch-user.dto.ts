import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    description: 'The userId of the branchUser',
    example: '0b38bf86-9f97-4417-8b7c-5113a40d4270',
    required: true,
  })
  @IsString()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'The branchId of the branchUser',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  branchId: string;
}
