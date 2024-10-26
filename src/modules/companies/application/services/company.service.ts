import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from '@/modules/companies/application/dto/create-company.dto';
import { UpdateCompanyDto } from '@/modules/companies/application/dto/update-company.dto';
import { CompanyResponseDto } from '../dto/company.response.dto';
import { CompanyRepositoryInterface } from '../../domain/interface/company.repository.interface';
import { RequestContextService } from '@/modules/request-context/request-context.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly requestContextService: RequestContextService,
    @Inject('CompanyRepositoryInterface')
    private readonly companyRepository: CompanyRepositoryInterface,
  ) {}

  async create(data: CreateCompanyDto): Promise<CompanyResponseDto> {
    const company = this.companyRepository.create(data);
    return company;
  }

  async findAll(params: any, tokenData: any) {
    return await this.companyRepository.findAll(params, tokenData);
  }

  async findById(id: string) {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async findByName(email: string) {
    const company = await this.companyRepository.findByName(email);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async remove(id: string) {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    await this.companyRepository.remove(id);

    return;
  }

  async update(id: string, data: UpdateCompanyDto) {
    let company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    company = await this.companyRepository.update(id, data);

    return company;
  }
}
