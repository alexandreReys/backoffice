import { ApiProperty } from '@nestjs/swagger';

export class AuthResetPasswordResponseDto {
  @ApiProperty({
    description: 'Message of Password reset sucessfull',
    example: 'Password reset sucessfull',
  })
  message: string;
}
