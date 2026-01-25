import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { BackofficeUsersController } from './backoffice-users.controller';
import { BackofficeUsersService } from './backoffice-users.service';

@Module({
  imports: [FirebaseModule],
  controllers: [BackofficeUsersController],
  providers: [BackofficeUsersService],
})
export class BackofficeUsersModule {}
