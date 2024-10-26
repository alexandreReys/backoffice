import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '@/modules/companies/infra/controller/company.controller';
import { CompanyService } from '@/modules/companies/application/services/company.service';

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [CompanyService],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
