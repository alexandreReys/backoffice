import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The email of the user',
    example: 'email@email.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'MyPassword123',
    required: true,
  })
  @IsString()
  password: string;
}
