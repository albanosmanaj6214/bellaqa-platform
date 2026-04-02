import { Injectable } from '@nestjs/common';

export const VAT_RATES = {
  food: 0.07,
  beverage: 0.19,
  service: 0.19,
  other: 0.19,
} as const;

export interface LineItemSnapshot {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitNetPrice: number;
  vatRate: number;
  pfand: number;
  lineNetTotal: number;
  lineVatTotal: number;
  linePfandTotal: number;
  lineGrossTotal: number;
}

export interface OrderTotals {
  subtotalNet: number;
  totalVat: number;
  totalPfand: number;
  totalGross: number;
  vat7Base: number;
  vat7Amount: number;
  vat19Base: number;
  vat19Amount: number;
  lineItems: LineItemSnapshot[];
}

@Injectable()
export class VatService {
  /**
   * Calculate gross price for B2C (inclusive of VAT and Pfand)
   */
  calcGrossPrice(netPrice: number, vatRate: number, pfand: number): number {
    return parseFloat((netPrice * (1 + vatRate) + pfand).toFixed(4));
  }

  /**
   * Calculate net price from gross (for B2C reverse calculation)
   */
  calcNetFromGross(grossPrice: number, vatRate: number, pfand: number): number {
    return parseFloat(((grossPrice - pfand) / (1 + vatRate)).toFixed(4));
  }

  /**
   * Create an IMMUTABLE line item snapshot for audit trail
   * This captures price data at the exact moment of order
   */
  createLineSnapshot(
    productId: string,
    sku: string,
    name: string,
    quantity: number,
    unitNetPrice: number,
    vatRate: number,
    pfand: number,
  ): LineItemSnapshot {
    const lineNetTotal = parseFloat((unitNetPrice * quantity).toFixed(4));
    const lineVatTotal = parseFloat((lineNetTotal * vatRate).toFixed(4));
    const linePfandTotal = parseFloat((pfand * quantity).toFixed(4));
    const lineGrossTotal = parseFloat((lineNetTotal + lineVatTotal + linePfandTotal).toFixed(4));

    return {
      productId,
      sku,
      name,
      quantity,
      unitNetPrice,
      vatRate,
      pfand,
      lineNetTotal,
      lineVatTotal,
      linePfandTotal,
      lineGrossTotal,
    };
  }

  /**
   * Aggregate order totals with split VAT reporting (7% vs 19%)
   */
  calcOrderTotals(lineItems: LineItemSnapshot[]): OrderTotals {
    let subtotalNet = 0;
    let totalVat = 0;
    let totalPfand = 0;
    let vat7Base = 0;
    let vat7Amount = 0;
    let vat19Base = 0;
    let vat19Amount = 0;

    for (const item of lineItems) {
      subtotalNet += item.lineNetTotal;
      totalVat += item.lineVatTotal;
      totalPfand += item.linePfandTotal;

      if (Math.abs(item.vatRate - 0.07) < 0.001) {
        vat7Base += item.lineNetTotal;
        vat7Amount += item.lineVatTotal;
      } else {
        vat19Base += item.lineNetTotal;
        vat19Amount += item.lineVatTotal;
      }
    }

    const totalGross = subtotalNet + totalVat + totalPfand;

    return {
      subtotalNet: parseFloat(subtotalNet.toFixed(4)),
      totalVat: parseFloat(totalVat.toFixed(4)),
      totalPfand: parseFloat(totalPfand.toFixed(4)),
      totalGross: parseFloat(totalGross.toFixed(4)),
      vat7Base: parseFloat(vat7Base.toFixed(4)),
      vat7Amount: parseFloat(vat7Amount.toFixed(4)),
      vat19Base: parseFloat(vat19Base.toFixed(4)),
      vat19Amount: parseFloat(vat19Amount.toFixed(4)),
      lineItems,
    };
  }
}
