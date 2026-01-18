import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IdToken } from '../common/decorators/id-token.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
   constructor(
    private readonly usersService: UsersService,
    private readonly firebaseService: FirebaseService,
  ) {}

  /**
   * Register a new user.
   * Creates a user in Firebase and assigns optional roles.
   */
  @Post('register')
  async registerUser(@Body() dto: RegisterUserDto) {
    return await this.usersService.registerUser(dto);
  }

  /**
   * Get the current user's profile.
   * Verifies the ID token and returns the decoded token payload.
   */
  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async profile(@IdToken() token: string) {
    return await this.firebaseService.verifyIdToken(token);
  }
}
