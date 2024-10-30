import { Test, TestingModule } from '@nestjs/testing';
import { BotController } from '@/modules/bots/infra/controller/bot.controller';
import { BotService } from '@/modules/bots/application/services/bot.service';
import { CreateBotDto } from '@/modules/bots/application/dto/create-bot.dto';
import { UpdateBotDto } from '@/modules/bots/application/dto/update-bot.dto';
import { BotResponseDto } from '@/modules/bots/application/dto/bot.response.dto';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

describe('BotController', () => {
  let controller: BotController;
  let service: BotService;

  beforeEach(async () => {
    const mockBotService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotController],
      providers: [
        {
          provide: BotService,
          useValue: mockBotService,
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

    controller = module.get<BotController>(BotController);
    service = module.get<BotService>(BotService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new bot', async () => {
      const createDto: CreateBotDto = { branchId: '1', name: 'New Bot' };
      const response: BotResponseDto = {
        id: '1',
        branchId: '1',
        name: 'New Bot',
      };
      jest.spyOn(service, 'create').mockResolvedValue(response);

      const result = await controller.create(createDto);
      expect(result).toEqual(response);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getAllBots', () => {
    it('should return all bots', async () => {
      const response: BotResponseDto[] = [
        { id: '1', branchId: '1', name: 'Bot A' },
        { id: '2', branchId: '1', name: 'Bot B' },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(response);

      const result = await controller.getAllBots({});
      expect(result).toEqual(response);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a bot by ID', async () => {
      const id = '1';
      const response: BotResponseDto = {
        id,
        branchId: '1',
        name: 'Bot A',
      };
      jest.spyOn(service, 'findById').mockResolvedValue(response);

      const result = await controller.findById(id);
      expect(result).toEqual(response);
      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if bot not found', async () => {
      const id = '1';
      jest.spyOn(service, 'findById').mockImplementation(() => {
        throw new NotFoundException('Bot not found');
      });

      await expect(controller.findById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a bot by name', async () => {
      const name = 'Bot A';
      const response: BotResponseDto[] = [{ id: '1', branchId: '1', name }];
      jest.spyOn(service, 'findByName').mockResolvedValue(response);

      const result = await controller.findByName(name);
      expect(result).toEqual(response);
      expect(service.findByName).toHaveBeenCalledWith(name);
    });
  });

  describe('deleteBot', () => {
    it('should delete a bot by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.deleteBot(id);
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a bot by ID', async () => {
      const id = '1';
      const updateDto: UpdateBotDto = { name: 'Updated Bot' };
      const response: BotResponseDto = {
        id,
        branchId: '1',
        name: 'Updated Bot',
      };
      jest.spyOn(service, 'update').mockResolvedValue(response);

      const result = await controller.update(id, updateDto);
      expect(result).toEqual(response);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });
});
