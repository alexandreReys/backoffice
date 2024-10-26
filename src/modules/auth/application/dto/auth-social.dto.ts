import { ApiProperty } from '@nestjs/swagger';

export class AuthSocialDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  email: string;

  @ApiProperty({ example: 'Jõao da Silva', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ example: '0b38bf86-9f97-441', description: 'Id Firebase' })
  socialId?: string;

  @ApiProperty({ example: '9f97-441', description: 'User Password Firebase' })
  password?: string;

  @ApiProperty({
    example: 'https://site.com/imagem.png',
    description: 'URL da foto do usuário',
  })
  photoUrl?: string;
}
