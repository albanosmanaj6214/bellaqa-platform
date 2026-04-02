import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { VatService } from '../vat/vat.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private vatService: VatService,
  ) {}

  async findAll(channel: 'b2b' | 'b2c' = 'b2c', lang: string = 'de') {
    const products = await this.repo.find({ where: { isActive: true } });
    return products.map(p => this.formatProduct(p, channel, lang as any));
  }

  async findOne(id: string, channel: 'b2b' | 'b2c' = 'b2c', lang: string = 'de') {
    const p = await this.repo.findOne({ where: { id } });
    return p ? this.formatProduct(p, channel, lang as any) : null;
  }

  async create(dto: any) {
    const product = this.repo.create(dto);
    return this.repo.save(product);
  }

  async update(id: string, dto: any) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  private formatProduct(p: Product, channel: 'b2b' | 'b2c', lang: string) {
    const unitNetPrice = parseFloat(p.unitNetPrice as any);
    const vatRate = parseFloat(p.vatRate as any);
    const pfand = parseFloat(p.pfand as any);
    const grossPrice = this.vatService.calcGrossPrice(unitNetPrice, vatRate, pfand);

    const nameMap: Record<string, string> = {
      de: p.nameDe,
      en: p.nameEn || p.nameDe,
      sq: p.nameSq || p.nameDe,
      tr: p.nameTr || p.nameDe,
      fr: p.nameFr || p.nameDe,
    };

    return {
      id: p.id,
      sku: p.sku,
      name: nameMap[lang] || p.nameDe,
      category: p.category,
      imageUrl: p.imageUrl,
      unitInStock: p.unitInStock,
      // B2B sees net prices + VAT breakdown
      ...(channel === 'b2b' ? {
        unitNetPrice,
        vatRate,
        vatAmount: parseFloat((unitNetPrice * vatRate).toFixed(4)),
        pfand,
        unitGrossPrice: grossPrice,
        displayPrice: unitNetPrice,
        priceLabel: 'Netto zzgl. MwSt.',
      } : {
        // B2C sees gross (all-inclusive)
        unitGrossPrice: grossPrice,
        displayPrice: grossPrice,
        priceLabel: 'inkl. MwSt. & Pfand',
        pfand: pfand > 0 ? pfand : undefined,
      }),
    };
  }
}
