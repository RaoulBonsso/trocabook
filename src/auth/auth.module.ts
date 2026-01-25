import { Global, Module } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthGuard, AuthService],
})

export class AuthModule {}
