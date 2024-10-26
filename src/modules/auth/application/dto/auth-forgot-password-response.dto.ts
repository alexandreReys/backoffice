import { ApiProperty } from '@nestjs/swagger';

export class AuthForgotPasswordResponseDto {
  @ApiProperty({
    description: 'Mensagem de Link de Rest de Email Enviado com Sucesso',
    example: 'Password reset link sent',
  })
  message: string;
}
