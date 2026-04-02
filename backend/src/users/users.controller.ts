import { Controller, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() { return this.usersService.findAll(); }

  @Get('me')
  getMe(@Request() req: any) { return this.usersService.findOne(req.user.userId); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) { return this.usersService.update(id, dto); }
}
