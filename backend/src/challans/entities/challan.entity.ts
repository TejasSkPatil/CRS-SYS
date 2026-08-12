import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

export type ChallanStatus =
  'draft' | 'confirmed' | 'delivered' | 'invoiced' | 'cancelled';

@Entity('challans')
export class Challan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  challanNumber: string;

  @ManyToOne(() => Customer, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'salesUserId' })
  salesUser: User;

  @Column()
  salesUserId: string;

  @Column({
    type: 'varchar',
    default: 'draft',
  })
  status: ChallanStatus;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @OneToMany(() => ChallanItem, (item) => item.challan, { cascade: true })
  items: ChallanItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('challan_items')
export class ChallanItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Challan, (challan) => challan.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challanId' })
  challan: Challan;

  @Column()
  challanId: string;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;
}
