import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrderLineItem } from './order-line-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ default: 'b2c' })
  channel: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 'de' })
  language: string;

  @Column({ name: 'subtotal_net', type: 'decimal', precision: 12, scale: 4, default: 0 })
  subtotalNet: number;

  @Column({ name: 'total_vat', type: 'decimal', precision: 12, scale: 4, default: 0 })
  totalVat: number;

  @Column({ name: 'total_pfand', type: 'decimal', precision: 12, scale: 4, default: 0 })
  totalPfand: number;

  @Column({ name: 'total_gross', type: 'decimal', precision: 12, scale: 4, default: 0 })
  totalGross: number;

  @Column({ name: 'stripe_payment_intent_id', nullable: true })
  stripePaymentIntentId: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ name: 'delivery_address', type: 'jsonb', nullable: true })
  deliveryAddress: any;

  @OneToMany(() => OrderLineItem, item => item.orderId)
  lineItems: OrderLineItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
