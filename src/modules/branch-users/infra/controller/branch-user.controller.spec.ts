import { Test, TestingModule } from '@nestjs/testing';
import { BranchController } from '@/modules/branch-users/infra/controller/branch-user.controller';
import { BranchUserService } from '@/modules/branch-users/application/services/branch-user.service';
import { CreateBranchDto } from '@/modules/branch-users/application/dto/create-branch-user.dto';
import { UpdateBranchDto } from '@/modules/branch-users/application/dto/update-branch-user.dto';
import { BranchResponseDto } from '@/modules/branch-users/application/dto/branch-user.response.dto';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

describe('BranchController', () => {
  let controller: BranchController;
  let service: BranchUserService;

  beforeEach(async () => {
    const mockBranchUserService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findBybranchId: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchController],
      providers: [
        {
          provide: BranchUserService,
          useValue: mockBranchUserService,
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

    controller = module.get<BranchController>(BranchController);
    service = module.get<BranchUserService>(BranchUserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new branchUser', async () => {
      const createDto: CreateBranchDto = {
        userId: '1',
        branchId: 'New BranchUser',
      };
      const response: BranchResponseDto = {
        id: '1',
        userId: '1',
        branchId: 'New BranchUser',
      };
      jest.spyOn(service, 'create').mockResolvedValue(response);

      const result = await controller.create(createDto);
      expect(result).toEqual(response);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getAllBranchUsers', () => {
    it('should return all branchUsers', async () => {
      const response: BranchResponseDto[] = [
        { id: '1', userId: '1', branchId: 'BranchUser A' },
        { id: '2', userId: '1', branchId: 'BranchUser B' },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(response);

      const result = await controller.getAllBranchUsers({});
      expect(result).toEqual(response);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a branchUser by ID', async () => {
      const id = '1';
      const response: BranchResponseDto = {
        id,
        userId: '1',
        branchId: 'BranchUser A',
      };
      jest.spyOn(service, 'findById').mockResolvedValue(response);

      const result = await controller.findById(id);
      expect(result).toEqual(response);
      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if branchUser not found', async () => {
      const id = '1';
      jest.spyOn(service, 'findById').mockImplementation(() => {
        throw new NotFoundException('BranchUser not found');
      });

      await expect(controller.findById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteBranch', () => {
    it('should delete a branchUser by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.deleteBranch(id);
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a branchUser by ID', async () => {
      const id = '1';
      const updateDto: UpdateBranchDto = {
        userId: 'userId',
        branchId: 'branchId',
      };
      const response: BranchResponseDto = {
        id,
        userId: '1',
        branchId: 'Updated BranchUser',
      };
      jest.spyOn(service, 'update').mockResolvedValue(response);

      const result = await controller.update(id, updateDto);
      expect(result).toEqual(response);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });
});
