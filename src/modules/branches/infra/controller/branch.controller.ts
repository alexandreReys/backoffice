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
import { BranchService } from '@/modules/branches/application/services/branch.service';
import { CreateBranchDto } from '@/modules/branches/application/dto/create-branch.dto';
import { UpdateBranchDto } from '@/modules/branches/application/dto/update-branch.dto';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BranchResponseDto } from '@/modules/branches/application/dto/branch.response.dto';
import { JwtAuthGuard } from '@/infra/jwt/jwt/jwt-auth.guard';
import { RolesGuard } from '@/infra/jwt/roles/roles.guard';
// import { FastifyRequest } from 'fastify';

@Controller('branches')
export class BranchController {
  constructor(private readonly branchesService: BranchService) {}

  @Post()
  @ApiTags('branches')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: BranchResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Branch already registered' })
  async create(
    @Body() createBranchDto: CreateBranchDto,
  ): Promise<BranchResponseDto> {
    return await this.branchesService.create(createBranchDto);
  }

  @Get()
  @ApiTags('branches')
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
  async getAllBranches(
    @Query() query,
    // @Req() request: FastifyRequest,
  ): Promise<any> {
    // const tokenData = this.tokenService.getBranchFromRequest(request);
    return await this.branchesService.findAll(query, {
      tokenData: 'tokenData',
    });
  }

  @Get(':id')
  @ApiTags('branches')
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
    description: 'Branch not found',
  })
  async findById(@Param('id') id: string) {
    return await this.branchesService.findById(id);
  }

  @Get('/name/:name')
  @ApiTags('branches')
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
    type: BranchResponseDto,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Name not found',
  })
  async findByName(@Param('name') name: string) {
    return await this.branchesService.findByName(name);
  }

  @Delete(':id')
  @ApiTags('branches')
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
    description: 'Branch not found',
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
    await this.branchesService.remove(id);
    return;
  }

  @Patch(':id')
  @ApiTags('branches')
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
  @ApiResponse({ status: 404, description: 'Branch not found' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBranchDto,
  ): Promise<BranchResponseDto> {
    return await this.branchesService.update(id, body);
  }
}
