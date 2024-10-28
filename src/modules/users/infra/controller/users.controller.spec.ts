import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/modules/users/infra/controller/users.controller';
import { UsersService } from '@/modules/users/application/services/users.service';
import { PrismaService } from '@/infra/database/prisma/PrismaService';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@/infra/jwt/roles/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        RolesGuard, // Inclui o RolesGuard
        {
          provide: JwtService, // Mock do JwtService
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: PrismaService, // Mock do PrismaService
          useValue: {}, // Adicione métodos mockados aqui, se necessário
        },
        {
          provide: 'UserRepositoryInterface', // Mock do UserRepositoryInterface
          useValue: {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
