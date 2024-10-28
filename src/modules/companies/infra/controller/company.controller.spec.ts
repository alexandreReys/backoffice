import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '@/modules/companies/infra/controller/company.controller';
import { CompanyService } from '@/modules/companies/application/services/company.service';
import { CreateCompanyDto } from '@/modules/companies/application/dto/create-company.dto';
import { UpdateCompanyDto } from '@/modules/companies/application/dto/update-company.dto';
import { CompanyResponseDto } from '@/modules/companies/application/dto/company.response.dto';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  beforeEach(async () => {
    const mockCompanyService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompanyService,
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

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const createDto: CreateCompanyDto = { name: 'New Company' };
      const response: CompanyResponseDto = { id: '1', name: 'New Company' };
      jest.spyOn(service, 'create').mockResolvedValue(response);

      const result = await controller.create(createDto);
      expect(result).toEqual(response);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getAllCompanies', () => {
    it('should return all companies', async () => {
      const response: CompanyResponseDto[] = [
        { id: '1', name: 'Company A' },
        { id: '2', name: 'Company B' },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(response);

      const result = await controller.getAllCompanies({});
      expect(result).toEqual(response);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a company by ID', async () => {
      const id = '1';
      const response: CompanyResponseDto = { id, name: 'Company A' };
      jest.spyOn(service, 'findById').mockResolvedValue(response);

      const result = await controller.findById(id);
      expect(result).toEqual(response);
      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if company not found', async () => {
      const id = '1';
      jest.spyOn(service, 'findById').mockImplementation(() => {
        throw new NotFoundException('Company not found');
      });

      await expect(controller.findById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a company by name', async () => {
      const name = 'Company A';
      const response: CompanyResponseDto[] = [{ id: '1', name }];
      jest.spyOn(service, 'findByName').mockResolvedValue(response);

      const result = await controller.findByName(name);
      expect(result).toEqual(response);
      expect(service.findByName).toHaveBeenCalledWith(name);
    });
  });

  describe('deleteCompany', () => {
    it('should delete a company by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.deleteCompany(id);
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a company by ID', async () => {
      const id = '1';
      const updateDto: UpdateCompanyDto = { name: 'Updated Company' };
      const response: CompanyResponseDto = { id, name: 'Updated Company' };
      jest.spyOn(service, 'update').mockResolvedValue(response);

      const result = await controller.update(id, updateDto);
      expect(result).toEqual(response);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });
});
