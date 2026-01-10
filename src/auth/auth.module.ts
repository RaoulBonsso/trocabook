import { Global, Module } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthGuard, AuthService],
})
export class AuthModule {}
