import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateFavoriDto } from './dto/create-favori.dto';
import { FavorisService } from './favoris.service';

@ApiTags('favoris')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('favoris')
export class FavorisController {
  constructor(private readonly favorisService: FavorisService) {}

  @Post()
  create(@Body() createFavoriDto: CreateFavoriDto, @Req() req: any) {
    return this.favorisService.create(createFavoriDto, req.user.uid);
  }

  @Get()
  findAllForUser(@Req() req: any) {
    return this.favorisService.findAllForUser(req.user.uid);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favorisService.remove(id);
  }
}
