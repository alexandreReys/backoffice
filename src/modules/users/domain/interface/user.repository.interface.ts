import { CreateUserDto } from '@/modules/users/application/dto/create-user.dto';
import { UserResponseDto } from '@/modules/users/application/dto/user.response.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';

export interface UserRepositoryInterface {
  create(data: CreateUserDto): Promise<UserResponseDto | null>;
  findByEmail(email: string): Promise<UserResponseDto | null>;
  findById(id: string): Promise<UserResponseDto | null>;
  findAll(params: any, tokenData: any);
  remove(id: string): Promise<void>;
  update(id: string, data: UpdateUserDto): Promise<UserResponseDto | null>;
}
