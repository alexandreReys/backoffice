import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { UsersController } from '@/modules/users/infra/users.controller';
import { PrismaService } from '@/infra/database/prisma/PrismaService';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
