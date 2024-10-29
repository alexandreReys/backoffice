import { CreateBranchDto } from '@/modules/branches/application/dto/create-branch.dto';
import { BranchResponseDto } from '@/modules/branches/application/dto/branch.response.dto';
import { UpdateBranchDto } from '../../application/dto/update-branch.dto';

export interface BranchRepositoryInterface {
  create(data: CreateBranchDto): Promise<BranchResponseDto>;
  findByName(name: string): Promise<BranchResponseDto[]>;
  findById(id: string): Promise<BranchResponseDto>;
  findAll(params: any, tokenData: any);
  remove(id: string): Promise<void>;
  update(id: string, data: UpdateBranchDto): Promise<BranchResponseDto>;
}
