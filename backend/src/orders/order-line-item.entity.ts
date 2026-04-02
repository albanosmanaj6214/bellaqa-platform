import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('order_line_items')
export class OrderLineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column()
  quantity: number;

  // IMMUTABLE AUDIT TRAIL SNAPSHOTS
  @Column({ name: 'snapshot_sku' })
  snapshotSku: string;

  @Column({ name: 'snapshot_name' })
  snapshotName: string;

  @Column({ name: 'snapshot_unit_net_price', type: 'decimal', precision: 12, scale: 4 })
  snapshotUnitNetPrice: number;

  @Column({ name: 'snapshot_vat_rate', type: 'decimal', precision: 5, scale: 4 })
  snapshotVatRate: number;

  @Column({ name: 'snapshot_pfand', type: 'decimal', precision: 12, scale: 4 })
  snapshotPfand: number;

  @Column({ name: 'line_net_total', type: 'decimal', precision: 12, scale: 4 })
  lineNetTotal: number;

  @Column({ name: 'line_vat_total', type: 'decimal', precision: 12, scale: 4 })
  lineVatTotal: number;

  @Column({ name: 'line_pfand_total', type: 'decimal', precision: 12, scale: 4 })
  linePfandTotal: number;

  @Column({ name: 'line_gross_total', type: 'decimal', precision: 12, scale: 4 })
  lineGrossTotal: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
