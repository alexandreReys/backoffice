import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The BranchId of the task',
    example: '0b38bf86-9f97-4417-8b7c-5113a40d4270',
    required: true,
  })
  @IsString()
  @IsUUID()
  branchId: string;

  @ApiProperty({
    description: 'The name of the task',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;
}
