import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './order.entity';
import { OrderLineItem } from './order-line-item.entity';
import { VatService } from '../vat/vat.service';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(OrderLineItem) private lineItemsRepo: Repository<OrderLineItem>,
    @InjectDataSource() private dataSource: DataSource,
    private vatService: VatService,
  ) {}

  async create(userId: string, channel: string, lang: string, items: any[], notes?: string, deliveryAddress?: any) {
    // Generate order number
    const seqResult = await this.dataSource.query("SELECT nextval('order_seq') as seq");
    const orderNumber = `BQ-${new Date().getFullYear()}-${seqResult[0].seq}`;

    // Fetch products and build snapshots
    const lineSnapshots = [];
    for (const item of items) {
      const product = await this.dataSource.query('SELECT * FROM products WHERE id = $1', [item.productId]);
      if (!product[0]) throw new NotFoundException(`Product ${item.productId} not found`);
      const p = product[0];
      const nameField = `name_${lang}` in p ? p[`name_${lang}`] || p.name_de : p.name_de;
      const snapshot = this.vatService.createLineSnapshot(
        p.id, p.sku, nameField, item.quantity,
        parseFloat(p.unit_net_price), parseFloat(p.vat_rate), parseFloat(p.pfand)
      );
      lineSnapshots.push(snapshot);
    }

    const totals = this.vatService.calcOrderTotals(lineSnapshots);

    // Save order in transaction
    return this.dataSource.transaction(async manager => {
      const order = manager.create(Order, {
        orderNumber, userId, channel, language: lang,
        subtotalNet: totals.subtotalNet,
        totalVat: totals.totalVat,
        totalPfand: totals.totalPfand,
        totalGross: totals.totalGross,
        notes, deliveryAddress,
      });
      await manager.save(order);

      for (const s of totals.lineItems) {
        const li = manager.create(OrderLineItem, {
          orderId: order.id,
          productId: s.productId,
          quantity: s.quantity,
          snapshotSku: s.sku,
          snapshotName: s.name,
          snapshotUnitNetPrice: s.unitNetPrice,
          snapshotVatRate: s.vatRate,
          snapshotPfand: s.pfand,
          lineNetTotal: s.lineNetTotal,
          lineVatTotal: s.lineVatTotal,
          linePfandTotal: s.linePfandTotal,
          lineGrossTotal: s.lineGrossTotal,
        });
        await manager.save(li);
      }

      return { ...order, lineItems: totals.lineItems, totals };
    });
  }

  async findAll(userId?: string, channel?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (channel) where.channel = channel;
    return this.ordersRepo.find({ where, order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    const lineItems = await this.lineItemsRepo.find({ where: { orderId: id } });
    return { ...order, lineItems };
  }

  async updateStatus(id: string, status: string) {
    await this.ordersRepo.update(id, { status });
    return this.findOne(id);
  }

  async getAnalytics() {
    const [b2bOrders, b2cOrders, totalRevenue] = await Promise.all([
      this.ordersRepo.count({ where: { channel: 'b2b' } }),
      this.ordersRepo.count({ where: { channel: 'b2c' } }),
      this.dataSource.query('SELECT COALESCE(SUM(total_gross), 0) as total FROM orders WHERE status != \'cancelled\''),
    ]);
    const statusCounts = await this.dataSource.query('SELECT status, COUNT(*) as count FROM orders GROUP BY status');
    return { b2bOrders, b2cOrders, totalRevenue: parseFloat(totalRevenue[0].total), statusCounts };
  }
}
