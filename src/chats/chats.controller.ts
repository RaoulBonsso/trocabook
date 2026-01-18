import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('chats')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  createChat(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.createChat(createChatDto);
  }

  @Get()
  findAllChats(@Req() req: any) {
    return this.chatsService.findAllChats(req.user.uid);
  }

  @Get(':id')
  findOneChat(@Param('id') id: string) {
      return this.chatsService.findOneChat(id);
  }

  @Post(':id/messages')
  sendMessage(@Param('id') id: string, @Body() createMessageDto: CreateMessageDto, @Req() req: any) {
      return this.chatsService.sendMessage(id, createMessageDto, req.user.uid);
  }

  @Get(':id/messages')
  findAllMessages(@Param('id') id: string) {
      return this.chatsService.findAllMessages(id);
  }
}
