import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { BackofficeUsersService } from './backoffice-users.service';
import { CreateBackofficeUserDto } from './dto/create-backoffice-user.dto';
import { LoginBackofficeUserDto } from './dto/login-backoffice-user.dto';
import { UpdateBackofficeUserDto } from './dto/update-backoffice-user.dto';

@Controller('backoffice-users')
export class BackofficeUsersController {
  constructor(private readonly backofficeUsersService: BackofficeUsersService) {}

  @Post('login')
  login(@Body() loginBackofficeUserDto: LoginBackofficeUserDto) {
    return this.backofficeUsersService.login(loginBackofficeUserDto);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createBackofficeUserDto: CreateBackofficeUserDto) {
    return this.backofficeUsersService.create(createBackofficeUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.backofficeUsersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.backofficeUsersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateBackofficeUserDto: UpdateBackofficeUserDto) {
    return this.backofficeUsersService.update(id, updateBackofficeUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.backofficeUsersService.remove(id);
  }
}
