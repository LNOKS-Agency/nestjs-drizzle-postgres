import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDataPayload } from './interface';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { DateUtil } from '../../utils/date-util/date.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    const isPasswordMatch = user
      ? await compare(password, user.password)
      : false;
    if (user && isPasswordMatch) {
      return user;
    }
    return undefined;
  }

  async login(user: UserDto) {
    const userRefreshToken = await this.refreshTokenService.findByUserId(
      user.id,
    );

    if (userRefreshToken) {
      await this.refreshTokenService.delete(userRefreshToken.id);
    }

    const { refreshToken } = await this.refreshTokenService.create({
      userId: user.id,
    });

    const accessToken = this.generateAccessToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const userRefreshToken = await this.refreshTokenService.findByRefreshToken(
      refreshToken,
    );

    if (DateUtil.isBeforeNow(userRefreshToken.refresh_token.expiresAt)) {
      await this.refreshTokenService.delete(userRefreshToken.refresh_token.id);
      throw new UnauthorizedException(null, 'Session expired');
    }

    await this.refreshTokenService.delete(userRefreshToken.refresh_token.id);
    const newRefreshToken = await this.refreshTokenService.create({
      userId: userRefreshToken.user.id,
    });

    const accessToken = this.generateAccessToken(userRefreshToken.user.id);

    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken.refreshToken,
    };
  }

  private generateAccessToken(userId: number) {
    const jwtBody: JwtPayloadDataPayload = {
      userId,
    };
    return this.jwtService.sign(jwtBody);
  }
}
