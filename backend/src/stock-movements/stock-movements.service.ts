import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectRepository(StockMovement)
    private stockMovementsRepository: Repository<StockMovement>,
    private dataSource: DataSource,
  ) {}

  async create(
    createStockMovementDto: CreateStockMovementDto,
    user: User | null,
  ): Promise<StockMovement> {
    const { productId, quantity, type, reference } = createStockMovementDto;

    // Use transaction to ensure stock update and ledger insertion are atomic
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const product = await transactionalEntityManager.findOne(Product, {
        where: { id: productId },
      });

      if (!product) {
        throw new BadRequestException(
          `Product with ID "${productId}" not found`,
        );
      }

      if (type === 'IN') {
        product.stockQuantity += quantity;
      } else {
        // Phase 10/12: OUT movement — stock must never go negative
        if (product.stockQuantity === 0) {
          throw new BadRequestException(
            `Cannot perform OUT movement for "${product.name}": current stock is 0`,
          );
        }
        if (product.stockQuantity < quantity) {
          throw new BadRequestException(
            `Insufficient stock for product "${product.name}". ` +
              `Available: ${product.stockQuantity}, Requested: ${quantity}`,
          );
        }
        product.stockQuantity -= quantity;

        // Phase 12: hard safety guard — should never trigger but prevents DB corruption
        if (product.stockQuantity < 0) {
          throw new BadRequestException(
            `Stock integrity error: operation would make "${product.name}" stock negative`,
          );
        }
      }

      // Save updated product
      await transactionalEntityManager.save(Product, product);

      // Save movement log
      const movement = this.stockMovementsRepository.create({
        productId,
        quantity,
        type,
        reference,
        userId: user ? user.id : null,
      });

      return transactionalEntityManager.save(StockMovement, movement);
    });
  }

  async findAll(): Promise<StockMovement[]> {
    return this.stockMovementsRepository.find({
      relations: { product: true, user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByProduct(productId: string): Promise<StockMovement[]> {
    return this.stockMovementsRepository.find({
      where: { productId },
      relations: { product: true, user: true },
      order: { createdAt: 'DESC' },
    });
  }
}
