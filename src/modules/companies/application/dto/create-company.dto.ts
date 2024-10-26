import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'The name of the company',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;
}
