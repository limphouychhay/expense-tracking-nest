import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    try {
      return await this.userRepo.save(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const user = await this.userRepo.findOneBy({ id });
      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userRepo.findOneBy({ username });
      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.userRepo.findOneBy({ id });

      return await this.userRepo.save({
        ...user,
        ...updateUserDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const result = await this.userRepo.delete({ id });
      if (result.affected > 0) {
        return {
          message: 'success',
        };
      }
      return {
        message: 'fail',
      };
    } catch (error) {
      throw error;
    }
  }
}
