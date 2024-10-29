import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    description: 'The CompanyId of the branch',
    example: '0b38bf86-9f97-4417-8b7c-5113a40d4270',
    required: true,
  })
  @IsString()
  @IsUUID()
  companyId: string;

  @ApiProperty({
    description: 'The name of the branch',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;
}
