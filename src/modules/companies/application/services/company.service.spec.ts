import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '@/modules/companies/application/services/company.service';
import { RequestContextService } from '@/modules/request-context/request-context.service';

describe('UsersService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        RequestContextService,
        {
          provide: 'CompanyRepositoryInterface',
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

    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
