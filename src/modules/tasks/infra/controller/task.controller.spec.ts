import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '@/modules/tasks/infra/controller/task.controller';
import { TaskService } from '@/modules/tasks/application/services/task.service';
import { CreateTaskDto } from '@/modules/tasks/application/dto/create-task.dto';
import { UpdateTaskDto } from '@/modules/tasks/application/dto/update-task.dto';
import { TaskResponseDto } from '@/modules/tasks/application/dto/task.response.dto';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const mockTaskService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createDto: CreateTaskDto = { branchId: '1', name: 'New Task' };
      const response: TaskResponseDto = {
        id: '1',
        branchId: '1',
        name: 'New Task',
      };
      jest.spyOn(service, 'create').mockResolvedValue(response);

      const result = await controller.create(createDto);
      expect(result).toEqual(response);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const response: TaskResponseDto[] = [
        { id: '1', branchId: '1', name: 'Task A' },
        { id: '2', branchId: '1', name: 'Task B' },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(response);

      const result = await controller.getAllTasks({});
      expect(result).toEqual(response);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a task by ID', async () => {
      const id = '1';
      const response: TaskResponseDto = {
        id,
        branchId: '1',
        name: 'Task A',
      };
      jest.spyOn(service, 'findById').mockResolvedValue(response);

      const result = await controller.findById(id);
      expect(result).toEqual(response);
      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if task not found', async () => {
      const id = '1';
      jest.spyOn(service, 'findById').mockImplementation(() => {
        throw new NotFoundException('Task not found');
      });

      await expect(controller.findById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a task by name', async () => {
      const name = 'Task A';
      const response: TaskResponseDto[] = [{ id: '1', branchId: '1', name }];
      jest.spyOn(service, 'findByName').mockResolvedValue(response);

      const result = await controller.findByName(name);
      expect(result).toEqual(response);
      expect(service.findByName).toHaveBeenCalledWith(name);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.deleteTask(id);
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a task by ID', async () => {
      const id = '1';
      const updateDto: UpdateTaskDto = { name: 'Updated Task' };
      const response: TaskResponseDto = {
        id,
        branchId: '1',
        name: 'Updated Task',
      };
      jest.spyOn(service, 'update').mockResolvedValue(response);

      const result = await controller.update(id, updateDto);
      expect(result).toEqual(response);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });
});
