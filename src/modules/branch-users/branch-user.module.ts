import { Module } from '@nestjs/common';
import { BranchUserService } from '@/modules/branch-users/application/services/branch-user.service';
import { BranchController } from '@/modules/branch-users/infra/controller/branch-user.controller';
import { PrismaService } from '@/infra/database/prisma/PrismaService';
import { BranchUserPostgresRepository } from '@/modules/branch-users/infra/repository/branch-user.postgres.repository';
import { JwtModule } from '@nestjs/jwt';
import { ContextModule } from '@/modules/request-context/context.module';
import { BranchModule } from '../branches/branch.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    ContextModule,
    BranchModule,
    UsersModule,
  ],
  controllers: [BranchController],
  providers: [
    PrismaService,
    BranchUserService,
    {
      provide: 'BranchRepositoryInterface',
      useClass: BranchUserPostgresRepository,
    },
  ],
  exports: [BranchUserService, 'BranchRepositoryInterface'],
})
export class BranchUserModule {}
