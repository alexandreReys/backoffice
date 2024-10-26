import { ApiProperty } from '@nestjs/swagger';

export class AuthSignUpResponseDto {
  @ApiProperty({
    example: '3242341-234234-123412',
    description: 'Id do usuário',
  })
  id?: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  email: string;

  @ApiProperty({ example: 'Jõao da Silva', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ example: '0b38bf86-9f97-441', description: 'Id Firebase' })
  socialId?: string;

  @ApiProperty({
    example: 1713614415,
    description: 'Data de criação do Usuário',
  })
  createdAt?: Date;

  @ApiProperty({
    example: 1713614415,
    description: 'Data de atualização do Usuário',
  })
  updatedAt?: Date;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkxNzU1ZGFmLTZlY2It',
    description: 'Token de Autorizaçãp',
  })
  token?: string;

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
  permissions?: string[];
}
