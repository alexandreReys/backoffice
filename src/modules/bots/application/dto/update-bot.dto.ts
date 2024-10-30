import { PartialType } from '@nestjs/mapped-types';
import { CreateBotDto } from '@/modules/bots/application/dto/create-bot.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBotDto extends PartialType(CreateBotDto) {
  @ApiProperty({
    description: 'The name of the bot',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;
}
