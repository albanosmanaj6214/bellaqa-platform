import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private repo: Repository<Invoice>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createFromOrder(orderId: string, lang: string = 'de') {
    const orderResult = await this.dataSource.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (!orderResult[0]) throw new Error('Order not found');
    const order = orderResult[0];

    const seqResult = await this.dataSource.query("SELECT nextval('invoice_seq') as seq");
    const invoiceNumber = `BQ-RE-${new Date().getFullYear()}-${seqResult[0].seq}`;

    const vatBreakdown = await this.dataSource.query(`
      SELECT
        SUM(CASE WHEN snapshot_vat_rate = 0.07 THEN line_net_total ELSE 0 END) as vat7_base,
        SUM(CASE WHEN snapshot_vat_rate = 0.07 THEN line_vat_total ELSE 0 END) as vat7_amount,
        SUM(CASE WHEN snapshot_vat_rate = 0.19 THEN line_net_total ELSE 0 END) as vat19_base,
        SUM(CASE WHEN snapshot_vat_rate = 0.19 THEN line_vat_total ELSE 0 END) as vat19_amount
      FROM order_line_items WHERE order_id = $1
    `, [orderId]);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const invoice = this.repo.create({
      invoiceNumber,
      orderId,
      userId: order.user_id,
      status: 'sent',
      language: lang,
      subtotalNet: parseFloat(order.subtotal_net),
      totalVat: parseFloat(order.total_vat),
      totalPfand: parseFloat(order.total_pfand),
      totalGross: parseFloat(order.total_gross),
      vat7Base: parseFloat(vatBreakdown[0].vat7_base || 0),
      vat7Amount: parseFloat(vatBreakdown[0].vat7_amount || 0),
      vat19Base: parseFloat(vatBreakdown[0].vat19_base || 0),
      vat19Amount: parseFloat(vatBreakdown[0].vat19_amount || 0),
      dueDate: dueDate.toISOString().split('T')[0],
    });

    return this.repo.save(invoice);
  }

  findAll(userId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  findOne(id: string) { return this.repo.findOne({ where: { id } }); }

  markPaid(id: string) {
    return this.repo.update(id, { status: 'paid', paidAt: new Date() });
  }
}
