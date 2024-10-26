import { CreateCompanyDto } from '@/modules/companies/application/dto/create-company.dto';
import { CompanyResponseDto } from '@/modules/companies/application/dto/company.response.dto';
import { UpdateCompanyDto } from '../../application/dto/update-company.dto';

export interface CompanyRepositoryInterface {
  create(data: CreateCompanyDto): Promise<CompanyResponseDto>;
  findByName(name: string): Promise<CompanyResponseDto[]>;
  findById(id: string): Promise<CompanyResponseDto>;
  findAll(params: any, tokenData: any);
  remove(id: string): Promise<void>;
  update(id: string, data: UpdateCompanyDto): Promise<CompanyResponseDto>;
}
