import { Module, Scope } from '@nestjs/common';
import { RequestContextService } from '@/modules/request-context/request-context.service';

@Module({
  providers: [
    {
      provide: RequestContextService,
      useClass: RequestContextService,
      scope: Scope.REQUEST,
    },
  ],
  exports: [RequestContextService],
})
export class ContextModule {}
