import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/modules/auth/infra/controller/auth.controller';
import { UsersService } from '@/modules/users/application/services/users.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [UsersService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
