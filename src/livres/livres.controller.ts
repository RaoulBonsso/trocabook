import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateLivreDto } from './dto/create-livre.dto';
import { UpdateLivreDto } from './dto/update-livre.dto';
import { LivresService } from './livres.service';

@ApiTags('livres')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('livres')
export class LivresController {
  constructor(private readonly livresService: LivresService) {}

  @Post()
  create(@Body() createLivreDto: CreateLivreDto, @Req() req: any) {
    // req.user is set by AuthGuard
    return this.livresService.create(createLivreDto, req.user.uid);
  }

  @Get()
  findAll() {
    return this.livresService.findAll();
  }

  @Get('user/:userId')
  findAllByOwner(@Param('userId') userId: string) {
    return this.livresService.findAllByOwner(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.livresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLivreDto: UpdateLivreDto) {
    return this.livresService.update(id, updateLivreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.livresService.remove(id);
  }
}
