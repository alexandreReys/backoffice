import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from '@/modules/tasks/application/dto/create-task.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: 'The name of the task',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;
}
