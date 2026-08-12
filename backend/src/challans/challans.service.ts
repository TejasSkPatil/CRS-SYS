import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Challan, ChallanStatus } from './entities/challan.entity';
import { ChallanItem } from './entities/challan-item.entity';
import { CreateChallanDto } from './dto/create-challan.dto';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { StockMovement } from '../stock-movements/entities/stock-movement.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChallansService {
  constructor(
    @InjectRepository(Challan)
    private challansRepository: Repository<Challan>,
    private dataSource: DataSource,
  ) {}

  async create(
    createChallanDto: CreateChallanDto,
    user: User,
  ): Promise<Challan> {
    return this.dataSource.transaction(async (entityManager) => {
      // 1. Verify Customer exists and check authorization if user is sales
      const customer = await entityManager.findOne(Customer, {
        where: { id: createChallanDto.customerId },
      });

      if (!customer) {
        throw new NotFoundException(
          `Customer with ID "${createChallanDto.customerId}" not found`,
        );
      }

      if (user.role === 'sales' && customer.assignedSalesId !== user.id) {
        throw new ForbiddenException(
          'You can only create challans for your own assigned customers',
        );
      }

      // 2. Generate Challan Number: CH-YYYYMMDD-XXXX
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randPart = Math.floor(1000 + Math.random() * 9000);
      const challanNumber = `CH-${datePart}-${randPart}`;

      // 3. Process Challan Items and Calculate Total
      let totalAmount = 0;
      const itemsToSave: ChallanItem[] = [];

      for (const itemDto of createChallanDto.items) {
        const product = await entityManager.findOne(Product, {
          where: { id: itemDto.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID "${itemDto.productId}" not found`,
          );
        }

        const unitPrice =
          itemDto.unitPrice !== undefined
            ? itemDto.unitPrice
            : Number(product.price);
        const itemTotal = unitPrice * itemDto.quantity;
        totalAmount += itemTotal;

        const challanItem = entityManager.getRepository(ChallanItem).create({
          productId: product.id,
          quantity: itemDto.quantity,
          unitPrice,
        });

        itemsToSave.push(challanItem);
      }

      // 4. Save Challan
      const challan = this.challansRepository.create({
        challanNumber,
        customerId: customer.id,
        salesUserId: user.id,
        notes: createChallanDto.notes,
        totalAmount,
        status: 'draft',
        items: itemsToSave,
      });

      return entityManager.save(Challan, challan);
    });
  }

  async confirm(id: string, user: User): Promise<Challan> {
    return this.dataSource.transaction(async (entityManager) => {
      const challan = await entityManager.findOne(Challan, {
        where: { id },
        relations: { items: { product: true }, customer: true },
      });

      if (!challan) {
        throw new NotFoundException(`Challan with ID "${id}" not found`);
      }

      if (user.role === 'sales' && challan.salesUserId !== user.id) {
        throw new ForbiddenException('Access denied: this is not your challan');
      }

      if (challan.status !== 'draft') {
        throw new BadRequestException(
          `Challan must be in "draft" status to confirm. Current: "${challan.status}"`,
        );
      }

      // Phase 11/12: Pre-validate ALL items before touching ANY stock
      // (prevents partial deduction if one item fails)
      for (const item of challan.items) {
        const product = await entityManager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product "${item.productId}" referenced in challan was not found`,
          );
        }

        if (product.stockQuantity === 0) {
          throw new BadRequestException(
            `Cannot confirm challan: product "${product.name}" has 0 stock available`,
          );
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}". ` +
              `Required: ${item.quantity}, Available: ${product.stockQuantity}`,
          );
        }
      }

      // All items passed — now deduct atomically
      for (const item of challan.items) {
        const product = await entityManager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) continue; // already validated above, defensive guard

        product.stockQuantity -= item.quantity;

        // Phase 12: hard safety guard
        if (product.stockQuantity < 0) {
          throw new BadRequestException(
            `Stock integrity error: confirming challan would make "${product.name}" stock negative`,
          );
        }

        await entityManager.save(Product, product);

        const movement = entityManager.getRepository(StockMovement).create({
          productId: product.id,
          quantity: item.quantity,
          type: 'OUT',
          reference: `Confirmed Challan #${challan.challanNumber}`,
          userId: user.id,
        });
        await entityManager.save(StockMovement, movement);
      }

      challan.status = 'confirmed';
      return entityManager.save(Challan, challan);
    });
  }

  async findAll(user: User): Promise<Challan[]> {
    const query = this.challansRepository
      .createQueryBuilder('challan')
      .leftJoinAndSelect('challan.customer', 'customer')
      .leftJoinAndSelect('challan.salesUser', 'salesUser')
      .leftJoinAndSelect('challan.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy('challan.createdAt', 'DESC');

    if (user.role === 'sales') {
      query.where('challan.salesUserId = :userId', { userId: user.id });
    }

    return query.getMany();
  }

  async findOne(id: string, user: User): Promise<Challan> {
    const challan = await this.challansRepository.findOne({
      where: { id },
      relations: { customer: true, salesUser: true, items: { product: true } },
    });

    if (!challan) {
      throw new NotFoundException(`Challan with ID "${id}" not found`);
    }

    if (user.role === 'sales' && challan.salesUserId !== user.id) {
      throw new ForbiddenException('Access denied: this is not your challan');
    }

    return challan;
  }

  async deliver(id: string, user: User): Promise<Challan> {
    return this.dataSource.transaction(async (entityManager) => {
      // Get challan and lock it for update in transaction
      const challan = await entityManager.findOne(Challan, {
        where: { id },
        relations: { items: { product: true }, customer: true },
      });

      if (!challan) {
        throw new NotFoundException(`Challan with ID "${id}" not found`);
      }

      if (challan.status !== 'draft') {
        throw new BadRequestException(
          `Challan must be in "draft" status to deliver. Current: "${challan.status}"`,
        );
      }

      // Deduct stock and record movement
      for (const item of challan.items) {
        const product = await entityManager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID "${item.productId}" not found during delivery`,
          );
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product "${product.name}". Required: ${item.quantity}, Available: ${product.stockQuantity}`,
          );
        }

        product.stockQuantity -= item.quantity;
        await entityManager.save(Product, product);

        // Record stock movement (OUT)
        const movement = entityManager.getRepository(StockMovement).create({
          productId: product.id,
          quantity: item.quantity,
          type: 'OUT',
          reference: `Delivery of Challan #${challan.challanNumber}`,
          userId: user.id,
        });
        await entityManager.save(StockMovement, movement);
      }

      challan.status = 'delivered';
      challan.deliveryDate = new Date();

      return entityManager.save(Challan, challan);
    });
  }

  async invoice(id: string, user: User): Promise<Challan> {
    return this.dataSource.transaction(async (entityManager) => {
      const challan = await entityManager.findOne(Challan, {
        where: { id },
        relations: { customer: true },
      });

      if (!challan) {
        throw new NotFoundException(`Challan with ID "${id}" not found`);
      }

      if (challan.status !== 'delivered') {
        throw new BadRequestException(
          `Challan must be in "delivered" status to invoice. Current: "${challan.status}"`,
        );
      }

      // Update Customer outstanding balance
      const customer = challan.customer;
      customer.balance = Number(customer.balance) + Number(challan.totalAmount);
      await entityManager.save(Customer, customer);

      challan.status = 'invoiced';

      return entityManager.save(Challan, challan);
    });
  }

  async cancel(id: string, user: User): Promise<Challan> {
    return this.dataSource.transaction(async (entityManager) => {
      const challan = await entityManager.findOne(Challan, {
        where: { id },
        relations: { customer: true, items: { product: true } },
      });

      if (!challan) {
        throw new NotFoundException(`Challan with ID "${id}" not found`);
      }

      if (challan.status === 'cancelled') {
        throw new BadRequestException('Challan is already cancelled');
      }

      if (challan.status === 'invoiced') {
        // Accounts or Admin only
        if (user.role !== 'admin' && user.role !== 'accounts') {
          throw new ForbiddenException(
            'Only Accounts or Admin users can cancel an invoiced challan',
          );
        }
        // Reverse customer balance
        const customer = challan.customer;
        customer.balance =
          Number(customer.balance) - Number(challan.totalAmount);
        await entityManager.save(Customer, customer);
      }

      if (
        challan.status === 'confirmed' ||
        challan.status === 'delivered' ||
        challan.status === 'invoiced'
      ) {
        // Reverse stock quantity since delivery is being cancelled
        for (const item of challan.items) {
          const product = await entityManager.findOne(Product, {
            where: { id: item.productId },
          });

          if (product) {
            product.stockQuantity += item.quantity;
            await entityManager.save(Product, product);

            // Record stock movement (IN - Reversion)
            const movement = entityManager.getRepository(StockMovement).create({
              productId: product.id,
              quantity: item.quantity,
              type: 'IN',
              reference: `Stock reversion for cancelled Challan #${challan.challanNumber}`,
              userId: user.id,
            });
            await entityManager.save(StockMovement, movement);
          }
        }
      }

      challan.status = 'cancelled';
      return entityManager.save(Challan, challan);
    });
  }
}
