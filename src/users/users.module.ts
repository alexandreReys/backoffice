import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { UsersController } from '@/users/infra/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
