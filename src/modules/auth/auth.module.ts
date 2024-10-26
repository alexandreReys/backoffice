import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { PrismaService } from '@/infra/database/prisma/PrismaService';
import { JwtStrategy } from '@/infra/jwt/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '@/modules/users/application/services/users.service';
import { AuthController } from '@/modules/auth/infra/controller/auth.controller';
import { UserPostgresRepository } from '@/modules/users/infra/repository/user.postgres.repository';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    JwtStrategy,
    AuthService,
    UsersService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserPostgresRepository,
    },
  ],
})
export class AuthModule {}
