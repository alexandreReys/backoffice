import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/application/dto/update-user.dto';
import { PrismaService } from '@/infra/database/prisma/PrismaService';
import { UserResponseDto } from '../dto/user.response.dto';
import { UserRepositoryInterface } from '../../domain/interface/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const email = data.email.toLowerCase().trim();
    const userEmail = await this.userRepository.findByEmail(email);
    if (userEmail) {
      throw new ConflictException('User already registered');
    }

    const user = this.userRepository.create(data);
    return user;
  }

  async findAll(params: any, tokenData: any) {
    return await this.userRepository.findAll(params, tokenData);
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(id);

    return;
  }

  async update(id: string, data: UpdateUserDto) {
    let user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user = await this.userRepository.update(id, data);

    return user;
  }
}
