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
import { BranchUserService } from '@/modules/branch-users/application/services/branch-user.service';
import { CreateBranchDto } from '@/modules/branch-users/application/dto/create-branch-user.dto';
import { UpdateBranchDto } from '@/modules/branch-users/application/dto/update-branch-user.dto';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BranchResponseDto } from '@/modules/branch-users/application/dto/branch-user.response.dto';
import { JwtAuthGuard } from '@/infra/jwt/jwt/jwt-auth.guard';
import { RolesGuard } from '@/infra/jwt/roles/roles.guard';
// import { FastifyRequest } from 'fastify';

@Controller('branch-users')
export class BranchController {
  constructor(private readonly branchUserService: BranchUserService) {}

  @Post()
  @ApiTags('branchUsers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: BranchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'BranchUser already registered' })
  async create(
    @Body() createBranchDto: CreateBranchDto,
  ): Promise<BranchResponseDto> {
    return await this.branchUserService.create(createBranchDto);
  }

  @Get()
  @ApiTags('branchUsers')
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
  async getAllBranchUsers(
    @Query() query,
    // @Req() request: FastifyRequest,
  ): Promise<any> {
    // const tokenData = this.tokenService.getBranchFromRequest(request);
    return await this.branchUserService.findAll(query, {
      tokenData: 'tokenData',
    });
  }

  @Get('/branch/')
  @ApiTags('branchUsers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'branchId', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [BranchResponseDto],
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Branch not found',
  })
  async findByBranch(@Query() query) {
    return await this.branchUserService.findByBranch(query);
  }

  @Get(':id')
  @ApiTags('branchUsers')
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
    type: BranchResponseDto,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'BranchUser not found',
  })
  async findById(@Param('id') id: string) {
    return await this.branchUserService.findById(id);
  }

  @Delete(':id')
  @ApiTags('branchUsers')
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
    description: 'BranchUser not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Deletion denied! Operation refused due to foreign key relationship',
  })
  async deleteBranch(
    @Param('id') id: string,
    // @Req() request: FastifyRequest,
  ): Promise<{ message: string }> {
    // const tokenData = this.tokenService.getBranchFromRequest(request);
    await this.branchUserService.remove(id);
    return;
  }

  @Patch(':id')
  @ApiTags('branchUsers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID da Empresa',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: BranchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'BranchUser not found' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBranchDto,
  ): Promise<BranchResponseDto> {
    return await this.branchUserService.update(id, body);
  }
}
