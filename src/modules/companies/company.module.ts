import { Module } from '@nestjs/common';
import { CompanyService } from '@/modules/companies/application/services/company.service';
import { CompanyController } from '@/modules/companies/infra/controller/company.controller';
import { PrismaService } from '@/infra/database/prisma/PrismaService';
import { CompanyPostgresRepository } from '@/modules/companies/infra/repository/company.postgres.repository';
import { JwtModule } from '@nestjs/jwt';
import { ContextModule } from '@/modules/request-context/context.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ContextModule,
  ],
  controllers: [CompanyController],
  providers: [
    PrismaService,
    CompanyService,
    {
      provide: 'CompanyRepositoryInterface',
      useClass: CompanyPostgresRepository,
    },
  ],
  exports: [CompanyService, 'CompanyRepositoryInterface'],
})
export class CompanyModule {}
