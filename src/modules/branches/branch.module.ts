import { Module } from '@nestjs/common';
import { BranchService } from '@/modules/branches/application/services/branch.service';
import { BranchController } from '@/modules/branches/infra/controller/branch.controller';
import { PrismaService } from '@/infra/database/prisma/PrismaService';
import { BranchPostgresRepository } from '@/modules/branches/infra/repository/branch.postgres.repository';
import { JwtModule } from '@nestjs/jwt';
import { ContextModule } from '@/modules/request-context/context.module';
import { CompanyModule } from '../companies/company.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    ContextModule,
    CompanyModule,
  ],
  controllers: [BranchController],
  providers: [
    PrismaService,
    BranchService,
    {
      provide: 'BranchRepositoryInterface',
      useClass: BranchPostgresRepository,
    },
  ],
  exports: [BranchService, 'BranchRepositoryInterface'],
})
export class BranchModule {}
