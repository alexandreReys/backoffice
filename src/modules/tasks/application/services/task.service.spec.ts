import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '@/modules/tasks/application/services/task.service';
import { RequestContextService } from '@/modules/request-context/request-context.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        RequestContextService,
        {
          provide: 'TaskRepositoryInterface',
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

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
