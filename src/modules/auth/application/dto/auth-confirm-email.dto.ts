import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthConfirmEmailDto {
  @ApiProperty({
    description: 'Token for E-Mail Confirmation',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIwMjQwZjIwLWUwZjMtNGIwZi1hZjIwLWU',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export function AuthConfirmEmailDtoValidationPipe() {
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
