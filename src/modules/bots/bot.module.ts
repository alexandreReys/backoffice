import { Module } from '@nestjs/common';
import { BotService } from '@/modules/bots/application/services/bot.service';
import { BotController } from '@/modules/bots/infra/controller/bot.controller';
import { PrismaService } from '@/infra/database/prisma/PrismaService';
import { BotPostgresRepository } from '@/modules/bots/infra/repository/bot.postgres.repository';
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
  controllers: [BotController],
  providers: [
    PrismaService,
    BotService,
    {
      provide: 'BotRepositoryInterface',
      useClass: BotPostgresRepository,
    },
  ],
  exports: [BotService, 'BotRepositoryInterface'],
})
export class BotModule {}
