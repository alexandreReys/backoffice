import { ApiProperty } from '@nestjs/swagger';

export class AuthSignUpDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  email: string;

  @ApiProperty({ example: 'password', description: 'Senha do usuário' })
  password: string;

  @ApiProperty({ example: 'Jõao da Silva', description: 'Nome do usuário' })
  name: string;
}
