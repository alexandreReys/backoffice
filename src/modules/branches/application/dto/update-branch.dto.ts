import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchDto } from '@/modules/branches/application/dto/create-branch.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @ApiProperty({
    description: 'The name of the branch',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;
}
