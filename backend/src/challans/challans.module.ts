import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallansService } from './challans.service';
import { ChallansController } from './challans.controller';
import { Challan } from './entities/challan.entity';
import { ChallanItem } from './entities/challan-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Challan, ChallanItem])],
  providers: [ChallansService],
  controllers: [ChallansController],
  exports: [ChallansService],
})
export class ChallansModule {}
