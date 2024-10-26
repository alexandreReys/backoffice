import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export function AuthForgotPasswordDtoValidationPipe() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: errors => {
      const messages = errors.map((error: any) => {
        const property = error.property;
        const constraints = Object.values(error.constraints).join(', ');
        return `${property} - ${constraints}`;
      });
      throw new BadRequestException(`Invalid fields: ${messages.join(', ')}`);
    },
  });
}
