import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/application/dto/update-user.dto';
import { PrismaService } from '@/infra/database/prisma/PrismaService';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const user = this.prisma.user.findUnique({
      where: { id: 'test example' },
    });

    console.log('createUserDto', createUserDto, user);

    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log('updateUserDto', updateUserDto);

    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
