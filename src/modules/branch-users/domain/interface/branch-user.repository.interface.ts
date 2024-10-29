import { CreateBranchDto } from '@/modules/branch-users/application/dto/create-branch-user.dto';
import { BranchResponseDto } from '@/modules/branch-users/application/dto/branch-user.response.dto';
import { UpdateBranchDto } from '../../application/dto/update-branch-user.dto';

export interface BranchUserRepositoryInterface {
  create(data: CreateBranchDto): Promise<BranchResponseDto>;
  findById(id: string): Promise<BranchResponseDto>;
  findByBranch(branchId): Promise<BranchResponseDto[]>;
  findByBranchUser(
    branchId: string,
    userId: string,
  ): Promise<BranchResponseDto>;
  findAll(params: any, tokenData: any);
  remove(id: string): Promise<void>;
  update(id: string, data: UpdateBranchDto): Promise<BranchResponseDto>;
}
