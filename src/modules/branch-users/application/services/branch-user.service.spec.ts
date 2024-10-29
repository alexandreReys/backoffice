import { Test, TestingModule } from '@nestjs/testing';
import { BranchUserService } from '@/modules/branch-users/application/services/branch-user.service';
import { RequestContextService } from '@/modules/request-context/request-context.service';

describe('UsersService', () => {
  let service: BranchUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchUserService,
        RequestContextService,
        {
          provide: 'BranchRepositoryInterface',
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findBybranchId: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BranchUserService>(BranchUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
