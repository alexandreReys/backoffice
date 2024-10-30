import { CreateTaskDto } from '@/modules/tasks/application/dto/create-task.dto';
import { TaskResponseDto } from '@/modules/tasks/application/dto/task.response.dto';
import { UpdateTaskDto } from '../../application/dto/update-task.dto';

export interface TaskRepositoryInterface {
  create(data: CreateTaskDto): Promise<TaskResponseDto>;
  findByName(name: string): Promise<TaskResponseDto[]>;
  findById(id: string): Promise<TaskResponseDto>;
  findAll(params: any, tokenData: any);
  remove(id: string): Promise<void>;
  update(id: string, data: UpdateTaskDto): Promise<TaskResponseDto>;
}
