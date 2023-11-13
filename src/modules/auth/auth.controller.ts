import {
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestWithUser } from './interface';
import { AllowUnauthorizedRequest } from './allow-unauthorized-request';
import { LocalAuthGuard } from "./guards/local-auth.guard";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @AllowUnauthorizedRequest()
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );
    return { accessToken, refreshToken, role: req.user.role };
  }

  @AllowUnauthorizedRequest()
  @Post('token/refresh')
  async refreshToken(@Req() req: RequestWithUser) {
    const refreshToken = req.headers['refresh_token'];
    if (typeof refreshToken === 'string') {
      return await this.authService.refreshToken(refreshToken);
    }
    throw new UnauthorizedException();
  }
}
