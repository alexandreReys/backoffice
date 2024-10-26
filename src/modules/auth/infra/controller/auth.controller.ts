import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthSigninResponseDto } from '../../application/dto/auth-signin-response.dto';
import { AuthSignInDto } from '../../application/dto/auth-signin.dto';
import { AuthSignUpResponseDto } from '../../application/dto/auth-signup-response.dto';
import { AuthSignUpDto } from '../../application/dto/auth-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/')
  @ApiTags('auth')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: AuthSignUpResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'User already registered' })
  async userSignup(
    @Body() data: AuthSignUpDto,
  ): Promise<AuthSignUpResponseDto | { message: string }> {
    const result = await this.authService.signup(data);
    if ('message' in result && result.message === 'User already registered') {
      throw new HttpException(result.message, HttpStatus.CONFLICT);
    }
    return result;
  }

  @Post('/')
  @ApiTags('auth')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: AuthSigninResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async authenticate(
    @Body() data: AuthSignInDto,
  ): Promise<AuthSigninResponseDto> {
    return await this.authService.authenticate(data);
  }
}
