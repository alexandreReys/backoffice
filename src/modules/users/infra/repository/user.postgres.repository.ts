import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/infra/database/prisma/PrismaService';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserResponseDto } from '../../application/dto/user.response.dto';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UserRepositoryInterface } from '../../domain/interface/user.repository.interface';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from '../../application/dto/update-user.dto';

@Injectable()
export class UserPostgresRepository implements UserRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserResponseDto | null> {
    const password = !data.password ? 'jTi6$3FldH%K#Fy' : data.password;
    const userEmail = data.email.toLowerCase().trim();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prismaService.user.create({
      data: {
        email: userEmail,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        socialId: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        permissions: true,
        photoUrl: true,
      },
    });

    return {
      ...newUser,
      permissions: newUser.permissions as string[],
    };
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    email = email.toLowerCase().trim();

    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        socialId: true,
        emailVerified: true,
        permissions: true,
        password: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      permissions: user.permissions as string[],
    };
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        socialId: true,
        emailVerified: true,
        permissions: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      permissions: user.permissions as string[],
    };
  }

  async findAll(params: any): Promise<any> {
    const { page = 1, limit = 10, name, email } = params;
    const skip = (page - 1) * limit;
    const filters: Prisma.UserWhereInput = {};

    const userEmail = email ? email.toLowerCase().trim() : '';

    if (name) {
      filters.name = { contains: name, mode: 'insensitive' };
    }
    if (email) {
      filters.email = { contains: userEmail, mode: 'insensitive' };
    }

    const [users, usersCount] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where: filters,
        skip,
        take: parseInt(limit as any, 10),
        select: {
          id: true,
          email: true,
          name: true,
          socialId: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          permissions: true,
        },
      }),
      this.prismaService.user.count({
        where: filters,
      }),
    ]);

    const totalPages = Math.ceil(usersCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      result: {
        users,
        meta: {
          hasNextPage,
          hasPreviousPage,
        },
      },
    };
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.user.delete({ where: { id } });
      return;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Deletion denied! Operation refused due to foreign key relationship',
          );
        }
      }
      throw new Error('Error deleting user');
    }
  }

  async update(
    id: string,
    data: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // if (!accessGrantedToOwnerOrAdm(id, tokenData)) {
    //   throw new UnauthorizedException('Operation not permitted for this User');
    // }

    const updatedUser = await this.prismaService.user
      .update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          socialId: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          permissions: true,
          photoUrl: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('User not found');
      });

    return {
      ...updatedUser,
      permissions: updatedUser.permissions as string[],
    };
  }
}
