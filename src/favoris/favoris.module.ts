import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { FavorisController } from './favoris.controller';
import { FavorisService } from './favoris.service';

@Module({
  imports: [FirebaseModule],
  controllers: [FavorisController],
  providers: [FavorisService],
})
export class FavorisModule {}
