import { Module } from '@nestjs/common';
import { EnfantsController } from './enfants.controller';
import { EnfantsService } from './enfants.service';

@Module({
  controllers: [EnfantsController],
  providers: [EnfantsService],
})
export class EnfantsModule {}
