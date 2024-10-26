import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from '@/modules/companies/application/dto/create-company.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty({
    description: 'The name of the company',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;
}
