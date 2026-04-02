import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'invoice_number', unique: true })
  invoiceNumber: string;

  @Column({ name: 'order_id', nullable: true })
  orderId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ default: 'draft' })
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

  @Column({ name: 'vat_7_base', type: 'decimal', precision: 12, scale: 4, default: 0 })
  vat7Base: number;

  @Column({ name: 'vat_7_amount', type: 'decimal', precision: 12, scale: 4, default: 0 })
  vat7Amount: number;

  @Column({ name: 'vat_19_base', type: 'decimal', precision: 12, scale: 4, default: 0 })
  vat19Base: number;

  @Column({ name: 'vat_19_amount', type: 'decimal', precision: 12, scale: 4, default: 0 })
  vat19Amount: number;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: string;

  @Column({ name: 'paid_at', nullable: true })
  paidAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
