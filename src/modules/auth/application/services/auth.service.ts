import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthSignUpResponseDto } from '../dto/auth-signup-response.dto';
import { AuthSignInDto } from '../dto/auth-signin.dto';
import { AuthSigninResponseDto } from '../dto/auth-signin-response.dto';
import { AuthSignUpDto } from '../dto/auth-signup.dto';
import { UsersService } from '@/modules/users/application/services/users.service';
import { UserRepositoryInterface } from '@/modules/users/domain/interface/user.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(
    data: AuthSignUpDto,
  ): Promise<AuthSignUpResponseDto | { message: string }> {
    const userEmail = data.email.toLowerCase().trim();

    const existingUser = await this.userRepository.findByEmail(userEmail);

    if (existingUser) {
      throw new ConflictException('User already registered');
    }

    const user = await this.usersService.create(data);

    // await this.sendConfirmationEmail(user, data.email);

    const token: string = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        permissions: user.permissions,
      },
      {},
    );
    return { ...user, token };
  }

  async authenticate(data: AuthSignInDto): Promise<AuthSigninResponseDto> {
    if (!data.email) {
      throw new BadRequestException('Email is required');
    }
    if (!data.password) {
      throw new BadRequestException('Password is required');
    }

    const userEmail = data.email.toLowerCase().trim();

    const user = await this.usersService.findByEmail(userEmail);

    if (!user) {
      throw new UnauthorizedException('Bad Credentials');
    }

    if (await bcrypt.compare(data.password, user.password)) {
      const token: string = await this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
          permissions: user.permissions,
        },
        {},
      );
      return {
        token,
        id: user.id,
        email: user.email,
        permissions: user.permissions,
      };
    }

    throw new UnauthorizedException('Bad Credentials');
  }
}
