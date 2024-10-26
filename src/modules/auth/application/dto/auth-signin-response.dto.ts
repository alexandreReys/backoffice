import { ApiProperty } from '@nestjs/swagger';

export class AuthSigninResponseDto {
  @ApiProperty({ example: 'teste somente', description: 'Token de acesso' })
  token?: string;

  @ApiProperty({
    example: 'teste somente',
    description: 'Token de acesso sem expiração',
  })
  token2?: string;

  @ApiProperty({ example: '111111-22222-3333', description: 'Id do Usuario' })
  id: string;

  @ApiProperty({ example: 'test@email.com', description: 'Email do Usuario' })
  email: string;

  @ApiProperty({ example: 'password', description: 'Senha do usuário' })
  password?: string;

  @ApiProperty({
    example: [
      'cms-write',
      'cms-read',
      'cms-delete',
      'post-write',
      'post-read',
      'post-delete',
    ],
    description: `
      Permissões do usuário, que podem incluir:
      - 'cms-write': Permissão para escrever no CMS.
      - 'cms-read': Permissão para ler no CMS.
      - 'cms-delete': Permissão para deletar no CMS.
      - 'post-write': Permissão para escrever no Blog.
      - 'post-read': Permissão para ler no Blog.
      - 'post-delete': Permissão para deletar no Blog.
      Usuários ADM possuem todas as permissões.`,
  })
  permissions: string[];

  @ApiProperty({
    example: 'https://fotos.com/foto.png',
    description: 'URL da foto de perfil do usuário',
  })
  photoUrl?: string;
}
