import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(@Query('channel') channel: any = 'b2c', @Query('lang') lang: string = 'de') {
    return this.productsService.findAll(channel, lang);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('channel') channel: any = 'b2c', @Query('lang') lang: string = 'de') {
    return this.productsService.findOne(id, channel, lang);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: any) { return this.productsService.create(dto); }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() dto: any) { return this.productsService.update(id, dto); }
}
