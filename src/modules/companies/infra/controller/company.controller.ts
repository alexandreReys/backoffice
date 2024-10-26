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
import { CompanyService } from '@/modules/companies/application/services/company.service';
import { CreateCompanyDto } from '@/modules/companies/application/dto/create-company.dto';
import { UpdateCompanyDto } from '@/modules/companies/application/dto/update-company.dto';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyResponseDto } from '@/modules/companies/application/dto/company.response.dto';
import { JwtAuthGuard } from '@/infra/jwt/jwt/jwt-auth.guard';
import { RolesGuard } from '@/infra/jwt/roles/roles.guard';
// import { FastifyRequest } from 'fastify';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companiesService: CompanyService) {}

  @Post()
  @ApiTags('companies')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: CompanyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Company already registered' })
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return await this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiTags('companies')
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
  async getAllCompanies(
    @Query() query,
    // @Req() request: FastifyRequest,
  ): Promise<any> {
    // const tokenData = this.tokenService.getCompanyFromRequest(request);
    return await this.companiesService.findAll(query, {
      tokenData: 'tokenData',
    });
  }

  @Get(':id')
  @ApiTags('companies')
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
    type: CompanyResponseDto,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  async findById(@Param('id') id: string) {
    return await this.companiesService.findById(id);
  }

  @Get('/name/:name')
  @ApiTags('companies')
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
    type: CompanyResponseDto,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Name not found',
  })
  async findByName(@Param('name') name: string) {
    return await this.companiesService.findByName(name);
  }

  @Delete(':id')
  @ApiTags('companies')
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
    description: 'Company not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Deletion denied! Operation refused due to foreign key relationship',
  })
  async deleteCompany(
    @Param('id') id: string,
    // @Req() request: FastifyRequest,
  ): Promise<{ message: string }> {
    // const tokenData = this.tokenService.getCompanyFromRequest(request);
    await this.companiesService.remove(id);
    return;
  }

  @Patch(':id')
  @ApiTags('companies')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID da Empresa',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: CompanyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Company not found' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return await this.companiesService.update(id, body);
  }
}
