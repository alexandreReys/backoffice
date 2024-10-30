import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  // Req,
} from '@nestjs/common';
import { TaskService } from '@/modules/tasks/application/services/task.service';
import { CreateTaskDto } from '@/modules/tasks/application/dto/create-task.dto';
import { UpdateTaskDto } from '@/modules/tasks/application/dto/update-task.dto';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskResponseDto } from '@/modules/tasks/application/dto/task.response.dto';
import { JwtAuthGuard } from '@/infra/jwt/jwt/jwt-auth.guard';
import { RolesGuard } from '@/infra/jwt/roles/roles.guard';
// import { FastifyRequest } from 'fastify';

@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  @Post()
  @ApiTags('tasks')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Task already registered' })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiTags('tasks')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  async getAllTasks(
    @Query() query,
    // @Req() request: FastifyRequest,
  ): Promise<any> {
    // const tokenData = this.tokenService.getTaskFromRequest(request);
    return await this.tasksService.findAll(query, {
      tokenData: 'tokenData',
    });
  }

  @Get(':id')
  @ApiTags('tasks')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID da Empresa',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  async findById(@Param('id') id: string) {
    return await this.tasksService.findById(id);
  }

  @Get('/name/:name')
  @ApiTags('tasks')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiParam({
    name: 'name',
    type: 'string',
    required: true,
    description: 'Nome da Empresa',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TaskResponseDto,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Name not found',
  })
  async findByName(@Param('name') name: string) {
    return await this.tasksService.findByName(name);
  }

  @Delete(':id')
  @ApiTags('tasks')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID da Empresa',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Deletion denied! Operation refused due to foreign key relationship',
  })
  async deleteTask(
    @Param('id') id: string,
    // @Req() request: FastifyRequest,
  ): Promise<{ message: string }> {
    // const tokenData = this.tokenService.getTaskFromRequest(request);
    await this.tasksService.remove(id);
    return;
  }

  @Patch(':id')
  @ApiTags('tasks')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID da Empresa',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.update(id, body);
  }
}
