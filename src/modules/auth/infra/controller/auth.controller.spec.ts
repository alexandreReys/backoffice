import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/modules/auth/infra/controller/auth.controller';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { UsersService } from '@/modules/users/application/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/infra/database/prisma/PrismaService';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: 'UserRepositoryInterface',
          useValue: {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
