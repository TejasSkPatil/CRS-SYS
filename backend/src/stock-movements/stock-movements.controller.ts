import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { StockMovement } from './entities/stock-movement.entity';

@Controller('stock-movements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  @Roles('admin', 'warehouse')
  async create(
    @Body() createStockMovementDto: CreateStockMovementDto,
    @GetUser() user: User,
  ): Promise<StockMovement> {
    return this.stockMovementsService.create(createStockMovementDto, user);
  }

  @Get()
  @Roles('admin', 'warehouse')
  async findAll(): Promise<StockMovement[]> {
    return this.stockMovementsService.findAll();
  }

  @Get('product/:productId')
  @Roles('admin', 'warehouse')
  async findByProduct(
    @Param('productId') productId: string,
  ): Promise<StockMovement[]> {
    return this.stockMovementsService.findByProduct(productId);
  }
}
