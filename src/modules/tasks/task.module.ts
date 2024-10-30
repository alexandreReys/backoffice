import { Module } from '@nestjs/common';
import { TaskService } from '@/modules/tasks/application/services/task.service';
import { TaskController } from '@/modules/tasks/infra/controller/task.controller';
import { PrismaService } from '@/infra/database/prisma/PrismaService';
import { TaskPostgresRepository } from '@/modules/tasks/infra/repository/task.postgres.repository';
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
  controllers: [TaskController],
  providers: [
    PrismaService,
    TaskService,
    {
      provide: 'TaskRepositoryInterface',
      useClass: TaskPostgresRepository,
    },
  ],
  exports: [TaskService, 'TaskRepositoryInterface'],
})
export class TaskModule {}
