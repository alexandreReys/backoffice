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
import { BotService } from '@/modules/bots/application/services/bot.service';
import { CreateBotDto } from '@/modules/bots/application/dto/create-bot.dto';
import { UpdateBotDto } from '@/modules/bots/application/dto/update-bot.dto';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BotResponseDto } from '@/modules/bots/application/dto/bot.response.dto';
import { JwtAuthGuard } from '@/infra/jwt/jwt/jwt-auth.guard';
import { RolesGuard } from '@/infra/jwt/roles/roles.guard';
// import { FastifyRequest } from 'fastify';

@Controller('bots')
export class BotController {
  constructor(private readonly botsService: BotService) {}

  @Post()
  @ApiTags('bots')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: BotResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Bot already registered' })
  async create(@Body() createBotDto: CreateBotDto): Promise<BotResponseDto> {
    return await this.botsService.create(createBotDto);
  }

  @Get()
  @ApiTags('bots')
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
  async getAllBots(
    @Query() query,
    // @Req() request: FastifyRequest,
  ): Promise<any> {
    // const tokenData = this.tokenService.getBotFromRequest(request);
    return await this.botsService.findAll(query, {
      tokenData: 'tokenData',
    });
  }

  @Get(':id')
  @ApiTags('bots')
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
    type: BotResponseDto,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Bot not found',
  })
  async findById(@Param('id') id: string) {
    return await this.botsService.findById(id);
  }

  @Get('/name/:name')
  @ApiTags('bots')
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
    type: BotResponseDto,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Name not found',
  })
  async findByName(@Param('name') name: string) {
    return await this.botsService.findByName(name);
  }

  @Delete(':id')
  @ApiTags('bots')
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
    description: 'Bot not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Deletion denied! Operation refused due to foreign key relationship',
  })
  async deleteBot(
    @Param('id') id: string,
    // @Req() request: FastifyRequest,
  ): Promise<{ message: string }> {
    // const tokenData = this.tokenService.getBotFromRequest(request);
    await this.botsService.remove(id);
    return;
  }

  @Patch(':id')
  @ApiTags('bots')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'ID da Empresa',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: BotResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bot not found' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBotDto,
  ): Promise<BotResponseDto> {
    return await this.botsService.update(id, body);
  }
}
