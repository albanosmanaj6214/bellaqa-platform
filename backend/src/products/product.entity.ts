import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column({ name: 'name_de' })
  nameDe: string;

  @Column({ name: 'name_en', nullable: true })
  nameEn: string;

  @Column({ name: 'name_sq', nullable: true })
  nameSq: string;

  @Column({ name: 'name_tr', nullable: true })
  nameTr: string;

  @Column({ name: 'name_fr', nullable: true })
  nameFr: string;

  @Column({ name: 'description_de', nullable: true })
  descriptionDe: string;

  @Column({ default: 'food' })
  category: string;

  @Column({ name: 'unit_net_price', type: 'decimal', precision: 12, scale: 4 })
  unitNetPrice: number;

  @Column({ name: 'vat_rate', type: 'decimal', precision: 5, scale: 4, default: 0.07 })
  vatRate: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, default: 0 })
  pfand: number;

  @Column({ name: 'unit_in_stock', default: 0 })
  unitInStock: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
