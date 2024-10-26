import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponseDto {
  @ApiProperty({
    description: 'The id of the company',
    example: '0b38bf86-9f97-4417-8b7c-5113a40d4270',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the company',
    example: 'John Doe',
  })
  name: string;
}
