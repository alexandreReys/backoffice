import { CreateBotDto } from '@/modules/bots/application/dto/create-bot.dto';
import { BotResponseDto } from '@/modules/bots/application/dto/bot.response.dto';
import { UpdateBotDto } from '../../application/dto/update-bot.dto';

export interface BotRepositoryInterface {
  create(data: CreateBotDto): Promise<BotResponseDto>;
  findByName(name: string): Promise<BotResponseDto[]>;
  findById(id: string): Promise<BotResponseDto>;
  findAll(params: any, tokenData: any);
  remove(id: string): Promise<void>;
  update(id: string, data: UpdateBotDto): Promise<BotResponseDto>;
}
