import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { pick } from 'lodash';

import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AccessTokenGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getProfile(@Req() req: Request) {
    const id = req.user['sub'];
    try {
      return pick(await this.userService.findById(id), [
        'id',
        'name',
        'username',
      ]);
    } catch (error) {
      throw error;
    }
  }

  @Put()
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const id = req.user['sub'];
    try {
      return pick(await this.userService.update(id, updateUserDto), [
        'id',
        'name',
        'username',
      ]);
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  async disableProfile(@Req() req: Request) {
    const id = req.user['sub'];
    try {
      return pick(await this.userService.update(id, { isActive: false }), [
        'id',
        'name',
        'username',
      ]);
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async deleteProfile(@Req() req: Request) {
    const id = req.user['sub'];
    try {
      return await this.userService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
