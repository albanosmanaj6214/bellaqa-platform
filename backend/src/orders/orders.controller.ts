import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.ordersService.create(
      req.user.userId, body.channel || req.user.type,
      body.lang || req.user.lang || 'de',
      body.items, body.notes, body.deliveryAddress
    );
  }

  @Get()
  findAll(@Request() req: any, @Query('channel') channel?: string) {
    const userId = req.user.type !== 'admin' ? req.user.userId : undefined;
    return this.ordersService.findAll(userId, channel);
  }

  @Get('analytics')
  getAnalytics() { return this.ordersService.getAnalytics(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.ordersService.findOne(id); }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}
