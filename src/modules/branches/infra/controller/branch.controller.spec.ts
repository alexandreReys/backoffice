import { Test, TestingModule } from '@nestjs/testing';
import { BranchController } from '@/modules/branches/infra/controller/branch.controller';
import { BranchService } from '@/modules/branches/application/services/branch.service';
import { CreateBranchDto } from '@/modules/branches/application/dto/create-branch.dto';
import { UpdateBranchDto } from '@/modules/branches/application/dto/update-branch.dto';
import { BranchResponseDto } from '@/modules/branches/application/dto/branch.response.dto';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

describe('BranchController', () => {
  let controller: BranchController;
  let service: BranchService;

  beforeEach(async () => {
    const mockBranchService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchController],
      providers: [
        {
          provide: BranchService,
          useValue: mockBranchService,
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
    service = module.get<BranchService>(BranchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new branch', async () => {
      const createDto: CreateBranchDto = { companyId: '1', name: 'New Branch' };
      const response: BranchResponseDto = {
        id: '1',
        companyId: '1',
        name: 'New Branch',
      };
      jest.spyOn(service, 'create').mockResolvedValue(response);

      const result = await controller.create(createDto);
      expect(result).toEqual(response);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getAllBranches', () => {
    it('should return all branches', async () => {
      const response: BranchResponseDto[] = [
        { id: '1', companyId: '1', name: 'Branch A' },
        { id: '2', companyId: '1', name: 'Branch B' },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(response);

      const result = await controller.getAllBranches({});
      expect(result).toEqual(response);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a branch by ID', async () => {
      const id = '1';
      const response: BranchResponseDto = {
        id,
        companyId: '1',
        name: 'Branch A',
      };
      jest.spyOn(service, 'findById').mockResolvedValue(response);

      const result = await controller.findById(id);
      expect(result).toEqual(response);
      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if branch not found', async () => {
      const id = '1';
      jest.spyOn(service, 'findById').mockImplementation(() => {
        throw new NotFoundException('Branch not found');
      });

      await expect(controller.findById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a branch by name', async () => {
      const name = 'Branch A';
      const response: BranchResponseDto[] = [{ id: '1', companyId: '1', name }];
      jest.spyOn(service, 'findByName').mockResolvedValue(response);

      const result = await controller.findByName(name);
      expect(result).toEqual(response);
      expect(service.findByName).toHaveBeenCalledWith(name);
    });
  });

  describe('deleteBranch', () => {
    it('should delete a branch by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.deleteBranch(id);
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a branch by ID', async () => {
      const id = '1';
      const updateDto: UpdateBranchDto = { name: 'Updated Branch' };
      const response: BranchResponseDto = {
        id,
        companyId: '1',
        name: 'Updated Branch',
      };
      jest.spyOn(service, 'update').mockResolvedValue(response);

      const result = await controller.update(id, updateDto);
      expect(result).toEqual(response);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });
});
