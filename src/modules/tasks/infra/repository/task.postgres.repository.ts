import { PrismaService } from '@/infra/database/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskResponseDto } from '../../application/dto/task.response.dto';
import { CreateTaskDto } from '../../application/dto/create-task.dto';
import { TaskRepositoryInterface } from '../../domain/interface/task.repository.interface';
import { Prisma } from '@prisma/client';
import { UpdateTaskDto } from '../../application/dto/update-task.dto';

@Injectable()
export class TaskPostgresRepository implements TaskRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateTaskDto): Promise<TaskResponseDto> {
    const newTask = await this.prismaService.task.create({
      data: {
        branchId: data.branchId,
        name: data.name,
      },
      select: {
        id: true,
        branchId: true,
        name: true,
      },
    });

    return newTask;
  }

  async findByName(name: string): Promise<TaskResponseDto[]> {
    name = name.toLowerCase().trim();

    const tasks = await this.prismaService.task.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        branchId: true,
        name: true,
      },
    });

    return tasks;
  }

  async findById(id: string): Promise<TaskResponseDto> {
    const task = await this.prismaService.task.findUnique({
      where: { id },
      select: {
        id: true,
        branchId: true,
        name: true,
      },
    });

    if (!task) {
      return null;
    }

    return task;
  }

  async findAll(params: any): Promise<any> {
    const { page = 1, limit = 10, name } = params;
    const skip = (page - 1) * limit;
    const filters: Prisma.TaskWhereInput = {};

    if (name) {
      filters.name = { contains: name, mode: 'insensitive' };
    }

    const [tasks, tasksCount] = await this.prismaService.$transaction([
      this.prismaService.task.findMany({
        where: filters,
        skip,
        take: parseInt(limit as any, 10),
        select: {
          id: true,
          branchId: true,
          name: true,
        },
      }),
      this.prismaService.task.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(tasksCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      result: {
        tasks,
        meta: {
          hasNextPage,
          hasPreviousPage,
        },
      },
    };
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.task.delete({ where: { id } });
      return;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Deletion denied! Operation refused due to foreign key relationship',
          );
        }
      }
      throw new Error('Error deleting task');
    }
  }

  async update(id: string, data: UpdateTaskDto): Promise<TaskResponseDto> {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updatedTask = await this.prismaService.task
      .update({
        where: { id },
        data,
        select: {
          id: true,
          branchId: true,
          name: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Task not found');
      });

    return updatedTask;
  }
}
