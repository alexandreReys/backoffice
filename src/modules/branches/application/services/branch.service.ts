import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from '@/modules/branches/application/dto/create-branch.dto';
import { UpdateBranchDto } from '@/modules/branches/application/dto/update-branch.dto';
import { BranchResponseDto } from '../dto/branch.response.dto';
import { BranchRepositoryInterface } from '../../domain/interface/branch.repository.interface';
import { RequestContextService } from '@/modules/request-context/request-context.service';
import { CompanyService } from '@/modules/companies/application/services/company.service';

@Injectable()
export class BranchService {
  constructor(
    private readonly requestContextService: RequestContextService,
    private readonly companyService: CompanyService,
    @Inject('BranchRepositoryInterface')
    private readonly branchRepository: BranchRepositoryInterface,
  ) {}

  async create(data: CreateBranchDto): Promise<BranchResponseDto> {
    const existingCompany = await this.companyService.findById(data.companyId);
    if (!existingCompany) {
      throw new NotFoundException('Company not found');
    }

    const branch = this.branchRepository.create(data);
    return branch;
  }

  async findAll(params: any, tokenData: any) {
    return await this.branchRepository.findAll(params, tokenData);
  }

  async findById(id: string) {
    const branch = await this.branchRepository.findById(id);

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async findByName(email: string) {
    const branch = await this.branchRepository.findByName(email);

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async remove(id: string) {
    const branch = await this.branchRepository.findById(id);

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    await this.branchRepository.remove(id);

    return;
  }

  async update(id: string, data: UpdateBranchDto) {
    let branch = await this.branchRepository.findById(id);

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    branch = await this.branchRepository.update(id, data);

    return branch;
  }
}
