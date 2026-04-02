import { Module } from '@nestjs/common';
import { VatService } from './vat.service';

@Module({
  providers: [VatService],
  exports: [VatService],
})
export class VatModule {}
