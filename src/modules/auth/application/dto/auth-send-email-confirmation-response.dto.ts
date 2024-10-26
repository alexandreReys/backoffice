import { ApiProperty } from '@nestjs/swagger';

export class AuthSendEmailConfirmationResponseDto {
  @ApiProperty({
    description: 'Message of Email Confirmation sucessfull',
    example: 'Email confirmation link sent sucessfully',
  })
  message: string;
}
