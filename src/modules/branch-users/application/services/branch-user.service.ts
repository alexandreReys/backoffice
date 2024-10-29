import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBranchDto } from '@/modules/branch-users/application/dto/create-branch-user.dto';
import { UpdateBranchDto } from '@/modules/branch-users/application/dto/update-branch-user.dto';
import { BranchResponseDto } from '../dto/branch-user.response.dto';
import { BranchUserRepositoryInterface } from '../../domain/interface/branch-user.repository.interface';
import { RequestContextService } from '@/modules/request-context/request-context.service';
import { BranchService } from '@/modules/branches/application/services/branch.service';
import { UsersService } from '@/modules/users/application/services/users.service';

@Injectable()
export class BranchUserService {
  constructor(
    private readonly requestContextService: RequestContextService,
    private readonly branchService: BranchService,
    private readonly userService: UsersService,
    @Inject('BranchRepositoryInterface')
    private readonly branchUserRepository: BranchUserRepositoryInterface,
  ) {}

  async create(data: CreateBranchDto): Promise<BranchResponseDto> {
    const existingUser = await this.userService.findById(data.userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const existingBranch = await this.branchService.findById(data.branchId);
    if (!existingBranch) {
      throw new NotFoundException('Branch not found');
    }

    const existingBranchUser = await this.branchUserRepository.findByBranchUser(
      data.branchId,
      data.userId,
    );

    if (existingBranchUser) {
      throw new ConflictException('BranchUser already exists');
    }

    const branchUser = this.branchUserRepository.create(data);
    return branchUser;
  }

  async findAll(params: any, tokenData: any) {
    return await this.branchUserRepository.findAll(params, tokenData);
  }

  async findById(id: string) {
    const branchUser = await this.branchUserRepository.findById(id);

    if (!branchUser) {
      throw new NotFoundException('BranchUser not found');
    }

    return branchUser;
  }

  async findByBranch(params: any): Promise<BranchResponseDto[]> {
    const branchUsers = await this.branchUserRepository.findByBranch(params);

    return branchUsers;
  }

  async remove(id: string) {
    const branchUser = await this.branchUserRepository.findById(id);

    if (!branchUser) {
      throw new NotFoundException('BranchUser not found');
    }

    await this.branchUserRepository.remove(id);

    return;
  }

  async update(id: string, data: UpdateBranchDto) {
    let branchUser = await this.branchUserRepository.findById(id);

    if (!branchUser) {
      throw new NotFoundException('BranchUser not found');
    }

    branchUser = await this.branchUserRepository.update(id, data);

    return branchUser;
  }
}
