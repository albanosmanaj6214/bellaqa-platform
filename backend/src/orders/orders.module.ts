import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { OrderLineItem } from './order-line-item.entity';
import { VatModule } from '../vat/vat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderLineItem]), VatModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
