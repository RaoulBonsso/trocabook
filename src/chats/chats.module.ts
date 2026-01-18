import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  imports: [EmailModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
