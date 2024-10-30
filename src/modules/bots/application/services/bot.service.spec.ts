import { Test, TestingModule } from '@nestjs/testing';
import { BotService } from '@/modules/bots/application/services/bot.service';
import { RequestContextService } from '@/modules/request-context/request-context.service';

describe('BotService', () => {
  let service: BotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotService,
        RequestContextService,
        {
          provide: 'BotRepositoryInterface',
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

    service = module.get<BotService>(BotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
