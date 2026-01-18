import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { SignalementsController } from './signalements.controller';
import { SignalementsService } from './signalements.service';

@Module({
  imports: [FirebaseModule],
  controllers: [SignalementsController],
  providers: [SignalementsService],
})
export class SignalementsModule {}
