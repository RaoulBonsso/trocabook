import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IdToken } from '../common/decorators/id-token.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { LoginDto } from '../users/dto/login.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  /**
   * Log in a user.
   * Accepts email and password, returns ID token and refresh token.
   */
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Log out a user.
   * Revokes the refresh token using the ID token.
   */
  @Post('logout')
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  logout(@IdToken() token: string) {
    return this.authService.logout(token);
  }

  /**
   * Refresh the ID token.
   * Accepts a valid refresh token and returns a new ID token.
   */
  @Post('refresh-auth')
  @HttpCode(200)
  refreshAuth(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshAuthToken(dto.refreshToken);
  }
}
