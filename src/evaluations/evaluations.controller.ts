import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { EvaluationsService } from './evaluations.service';

@ApiTags('evaluations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  create(@Body() createEvaluationDto: CreateEvaluationDto, @Req() req: any) {
    return this.evaluationsService.create(createEvaluationDto, req.user.uid);
  }

  @Get('user/:userId')
  findAllForUser(@Param('userId') userId: string) {
    return this.evaluationsService.findAllForUser(userId);
  }
}
