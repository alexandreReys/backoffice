import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '@/modules/products/infra/controller/product.controller';
import { ProductService } from '@/modules/products/application/services/product.service';
import { CreateProductDto } from '@/modules/products/application/dto/create-product.dto';
import { UpdateProductDto } from '@/modules/products/application/dto/update-product.dto';
import { ProductResponseDto } from '@/modules/products/application/dto/product.response.dto';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const mockProductService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
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

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createDto: CreateProductDto = {
        branchId: '1',
        name: 'New Product',
      };
      const response: ProductResponseDto = {
        id: '1',
        branchId: '1',
        name: 'New Product',
      };
      jest.spyOn(service, 'create').mockResolvedValue(response);

      const result = await controller.create(createDto);
      expect(result).toEqual(response);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const response: ProductResponseDto[] = [
        { id: '1', branchId: '1', name: 'Product A' },
        { id: '2', branchId: '1', name: 'Product B' },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(response);

      const result = await controller.getAllProducts({});
      expect(result).toEqual(response);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a product by ID', async () => {
      const id = '1';
      const response: ProductResponseDto = {
        id,
        branchId: '1',
        name: 'Product A',
      };
      jest.spyOn(service, 'findById').mockResolvedValue(response);

      const result = await controller.findById(id);
      expect(result).toEqual(response);
      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if product not found', async () => {
      const id = '1';
      jest.spyOn(service, 'findById').mockImplementation(() => {
        throw new NotFoundException('Product not found');
      });

      await expect(controller.findById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a product by name', async () => {
      const name = 'Product A';
      const response: ProductResponseDto[] = [{ id: '1', branchId: '1', name }];
      jest.spyOn(service, 'findByName').mockResolvedValue(response);

      const result = await controller.findByName(name);
      expect(result).toEqual(response);
      expect(service.findByName).toHaveBeenCalledWith(name);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.deleteProduct(id);
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a product by ID', async () => {
      const id = '1';
      const updateDto: UpdateProductDto = { name: 'Updated Product' };
      const response: ProductResponseDto = {
        id,
        branchId: '1',
        name: 'Updated Product',
      };
      jest.spyOn(service, 'update').mockResolvedValue(response);

      const result = await controller.update(id, updateDto);
      expect(result).toEqual(response);
      expect(service.update).toHaveBeenCalledWith(id, updateDto);
    });
  });
});
