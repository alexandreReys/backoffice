import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '@/modules/tasks/application/dto/create-task.dto';
import { UpdateTaskDto } from '@/modules/tasks/application/dto/update-task.dto';
import { TaskResponseDto } from '../dto/task.response.dto';
import { TaskRepositoryInterface } from '../../domain/interface/task.repository.interface';
import { RequestContextService } from '@/modules/request-context/request-context.service';
import { BranchService } from '@/modules/branches/application/services/branch.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly requestContextService: RequestContextService,
    private readonly branchService: BranchService,
    @Inject('TaskRepositoryInterface')
    private readonly taskRepository: TaskRepositoryInterface,
  ) {}

  async create(data: CreateTaskDto): Promise<TaskResponseDto> {
    const existingBranch = await this.branchService.findById(data.branchId);
    if (!existingBranch) {
      throw new NotFoundException('Branch not found');
    }

    const task = this.taskRepository.create(data);
    return task;
  }

  async findAll(params: any, tokenData: any) {
    return await this.taskRepository.findAll(params, tokenData);
  }

  async findById(id: string) {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async findByName(email: string) {
    const task = await this.taskRepository.findByName(email);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async remove(id: string) {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.remove(id);

    return;
  }

  async update(id: string, data: UpdateTaskDto) {
    let task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task = await this.taskRepository.update(id, data);

    return task;
  }
}
