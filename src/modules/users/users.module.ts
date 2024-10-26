import { Module } from '@nestjs/common';
import { UsersService } from '@/modules/users/application/services/users.service';
import { UsersController } from '@/modules/users/infra/controller/users.controller';
import { PrismaService } from '@/infra/database/prisma/PrismaService';
import { UserPostgresRepository } from '@/modules/users/infra/repository/user.postgres.repository';
import { JwtStrategy } from '@/infra/jwt/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [
    PrismaService,
    JwtStrategy,
    UsersService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserPostgresRepository,
    },
  ],
  exports: [UsersService, 'UserRepositoryInterface'],
})
export class UsersModule {}
