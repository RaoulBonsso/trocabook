import { Module } from '@nestjs/common';
import { LivresController } from './livres.controller';
import { LivresService } from './livres.service';

@Module({
  controllers: [LivresController],
  providers: [LivresService],
})
export class LivresModule {}
