import { Module } from '@nestjs/common';
import { ProductService } from '@/modules/products/application/services/product.service';
import { ProductController } from '@/modules/products/infra/controller/product.controller';
import { PrismaService } from '@/infra/database/prisma/PrismaService';
import { ProductPostgresRepository } from '@/modules/products/infra/repository/product.postgres.repository';
import { JwtModule } from '@nestjs/jwt';
import { ContextModule } from '@/modules/request-context/context.module';
import { BranchModule } from '@/modules/branches/branch.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    ContextModule,
    BranchModule,
  ],
  controllers: [ProductController],
  providers: [
    PrismaService,
    ProductService,
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductPostgresRepository,
    },
  ],
  exports: [ProductService, 'ProductRepositoryInterface'],
})
export class ProductModule {}
