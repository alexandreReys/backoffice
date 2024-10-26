import { ApiProperty } from '@nestjs/swagger';

export class AuthSignInDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  email: string;

  @ApiProperty({ example: 'password', description: 'Senha do usuário' })
  password: string;
}
