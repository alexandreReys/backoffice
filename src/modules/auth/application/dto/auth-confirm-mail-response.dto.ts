import { ApiProperty } from '@nestjs/swagger';

export class AuthConfirmEmailResponseDto {
  @ApiProperty({
    description: 'Message of E-Mail Confirmation sucessfull',
    example: 'E-Mail Confirmed sucessfull',
  })
  message: string;
}
