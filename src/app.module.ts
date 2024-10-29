import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CompanyModule } from '@/modules/companies/company.module';
import { TokenMiddleware } from '@/middlewares/token.middleware';
import { ContextModule } from '@/modules/request-context/context.module';
import { JwtModule } from '@nestjs/jwt';
import { BranchModule } from './modules/branches/branch.module';
import { BranchUserModule } from './modules/branch-users/branch-user.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    CompanyModule,
    BranchModule,
    BranchUserModule,
    ContextModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes('*');
  }
}
