import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { SignInDto } from './dto/sign-in.dto';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

import { compareData, hashData } from 'src/common/hash.helper';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  private async getTokens(id: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          username,
        },
        {
          secret: this.configService.get<string>('REFRESH_JWT_SECRET_KEY'),
          expiresIn: this.configService.get<string>('REFRESH_JWT_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(id: number, refreshToken: string) {
    const hashedRefreshToken = await hashData(refreshToken);
    await this.userService.update(id, {
      refreshToken: hashedRefreshToken,
    });
  }

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.userService.findByUsername(signInDto.username);
      if (!user) {
        throw new NotFoundException();
      }

      const isPasswordMatch = await compareData(
        user.password,
        signInDto.password,
      );
      if (!isPasswordMatch) {
        throw new UnauthorizedException();
      }

      const tokens = await this.getTokens(user.id, user.username);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.findByUsername(
        createUserDto.username,
      );
      if (user) {
        throw new ConflictException();
      }

      const hash = await hashData(createUserDto.password);
      const newUser = await this.userService.create({
        ...createUserDto,
        password: hash,
      });
      const tokens = await this.getTokens(newUser.id, newUser.username);
      await this.updateRefreshToken(newUser.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(id: number, refreshToken: string) {
    try {
      const user = await this.userService.findById(id);
      if (!user || !user.refreshToken) {
        throw new ForbiddenException();
      }

      const refreshTokenMatches = await compareData(
        user.refreshToken,
        refreshToken,
      );
      if (!refreshTokenMatches) {
        throw new UnauthorizedException();
      }

      const tokens = await this.getTokens(user.id, user.username);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async logout(id: number) {
    await this.userService.update(id, { refreshToken: null });
    return {
      message: 'success',
    };
  }
}
