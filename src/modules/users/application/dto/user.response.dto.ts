import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'The id of the user',
    example: '0b38bf86-9f97-4417-8b7c-5113a40d4270',
  })
  id: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'email@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'MyPassword123',
  })
  password?: string;

  @ApiProperty({
    description: 'The permissions of the user',
    example: '["cms-write", "cms-read"]',
  })
  permissions?: string[];
}
