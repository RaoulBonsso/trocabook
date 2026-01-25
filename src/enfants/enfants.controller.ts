import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateEnfantDto } from './dto/create-enfant.dto';
import { UpdateEnfantDto } from './dto/update-enfant.dto';
import { EnfantsService } from './enfants.service';

@ApiTags('enfants')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('enfants')
export class EnfantsController {
  constructor(private readonly enfantsService: EnfantsService) {}

  @Post()
  create(@Body() createEnfantDto: CreateEnfantDto) {
    return this.enfantsService.create(createEnfantDto);
  }

  @Get()
  findAll() {
    return this.enfantsService.findAll();
  }

  @Get('parent/:parentId')
  findAllByParent(@Param('parentId') parentId: string) {
    return this.enfantsService.findAllByParent(parentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enfantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnfantDto: UpdateEnfantDto) {
    return this.enfantsService.update(id, updateEnfantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enfantsService.remove(id);
  }
}
