import { Global, Module } from '@nestjs/common';
import { ReputationService } from './services/reputation.service';

@Global()
@Module({
  providers: [ReputationService],
  exports: [ReputationService],
})
export class ReputationModule {}
