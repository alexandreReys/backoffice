import { Test, TestingModule } from '@nestjs/testing';
import { BranchService } from '@/modules/branches/application/services/branch.service';
import { RequestContextService } from '@/modules/request-context/request-context.service';

describe('UsersService', () => {
  let service: BranchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchService,
        RequestContextService,
        {
          provide: 'BranchRepositoryInterface',
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByName: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BranchService>(BranchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
