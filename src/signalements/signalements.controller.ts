import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateModerationDto } from './dto/create-moderation.dto';
import { CreateSignalementDto } from './dto/create-signalement.dto';
import { SignalementsService } from './signalements.service';

@ApiTags('signalements')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('signalements')
export class SignalementsController {
  constructor(private readonly signalementsService: SignalementsService) {}

  @Post()
  create(@Body() createSignalementDto: CreateSignalementDto, @Req() req: any) {
    return this.signalementsService.create(createSignalementDto, req.user.uid);
  }

  @Get() // Admin only ideally
  findAll() {
    return this.signalementsService.findAll();
  }

  @Post('moderation') // Admin only ideally
  moderate(@Body() createModerationDto: CreateModerationDto, @Req() req: any) {
    return this.signalementsService.createModeration(createModerationDto, req.user.uid);
  }
}
