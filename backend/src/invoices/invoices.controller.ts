import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
@UseGuards(AuthGuard('jwt'))
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.type !== 'admin' ? req.user.userId : undefined;
    return this.invoicesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.invoicesService.findOne(id); }

  @Post('from-order/:orderId')
  createFromOrder(@Param('orderId') orderId: string, @Body() body: { lang?: string }) {
    return this.invoicesService.createFromOrder(orderId, body.lang || 'de');
  }

  @Patch(':id/paid')
  markPaid(@Param('id') id: string) { return this.invoicesService.markPaid(id); }
}
