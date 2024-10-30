import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBotDto } from '@/modules/bots/application/dto/create-bot.dto';
import { UpdateBotDto } from '@/modules/bots/application/dto/update-bot.dto';
import { BotResponseDto } from '../dto/bot.response.dto';
import { BotRepositoryInterface } from '../../domain/interface/bot.repository.interface';
import { RequestContextService } from '@/modules/request-context/request-context.service';
import { BranchService } from '@/modules/branches/application/services/branch.service';

@Injectable()
export class BotService {
  constructor(
    private readonly requestContextService: RequestContextService,
    private readonly branchService: BranchService,
    @Inject('BotRepositoryInterface')
    private readonly botRepository: BotRepositoryInterface,
  ) {}

  async create(data: CreateBotDto): Promise<BotResponseDto> {
    const existingBranch = await this.branchService.findById(data.branchId);
    if (!existingBranch) {
      throw new NotFoundException('Branch not found');
    }

    const bot = this.botRepository.create(data);
    return bot;
  }

  async findAll(params: any, tokenData: any) {
    return await this.botRepository.findAll(params, tokenData);
  }

  async findById(id: string) {
    const bot = await this.botRepository.findById(id);

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    return bot;
  }

  async findByName(email: string) {
    const bot = await this.botRepository.findByName(email);

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    return bot;
  }

  async remove(id: string) {
    const bot = await this.botRepository.findById(id);

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    await this.botRepository.remove(id);

    return;
  }

  async update(id: string, data: UpdateBotDto) {
    let bot = await this.botRepository.findById(id);

    if (!bot) {
      throw new NotFoundException('Bot not found');
    }

    bot = await this.botRepository.update(id, data);

    return bot;
  }
}
