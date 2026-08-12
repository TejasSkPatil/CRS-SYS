import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    this.logger.log('Checking database and seeding if necessary...');
    await this.seedUsers();
    await this.seedProducts();
    await this.seedCustomers();
    this.logger.log('Seeding check completed.');
  }

  private async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);
    const count = await userRepository.count();

    if (count > 0) {
      this.logger.log('Users already exist. Skipping user seeding.');
      return;
    }

    this.logger.log('No users found. Seeding default users...');

    const salt = await bcrypt.genSalt(10);

    const usersToSeed = [
      {
        username: 'admin',
        password: 'admin123',
        name: 'System Administrator',
        role: 'admin',
      },
      {
        username: 'sales',
        password: 'sales123',
        name: 'Sarah Sales Manager',
        role: 'sales',
      },
      {
        username: 'warehouse',
        password: 'warehouse123',
        name: 'Willy Warehouse Executive',
        role: 'warehouse',
      },
      {
        username: 'accounts',
        password: 'accounts123',
        name: 'Alex Accounts Officer',
        role: 'accounts',
      },
    ];

    for (const u of usersToSeed) {
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const user = userRepository.create({
        username: u.username,
        password: hashedPassword,
        name: u.name,
        role: u.role as any,
      });
      await userRepository.save(user);
      this.logger.log(`Seeded user: ${u.username} (${u.role})`);
    }
  }

  private async seedProducts() {
    const productRepository = this.dataSource.getRepository(Product);
    const count = await productRepository.count();

    if (count > 0) {
      this.logger.log('Products already exist. Skipping product seeding.');
      return;
    }

    this.logger.log('No products found. Seeding default products...');

    const productsToSeed = [
      {
        name: 'Enterprise Laptop Pro',
        sku: 'LAP-PRO-001',
        category: 'Computers',
        description:
          'High-performance developer laptop with 32GB RAM, 1TB SSD.',
        price: 1499.99,
        cost: 950.0,
        stockQuantity: 45,
        minimumStock: 10,
        location: 'Warehouse A - Shelf 1',
      },
      {
        name: 'UltraWide Curved Monitor 34"',
        sku: 'MON-CURV-002',
        category: 'Displays',
        description: 'Immersive screen with 144Hz refresh rate, HDR support.',
        price: 499.99,
        cost: 310.0,
        stockQuantity: 28,
        minimumStock: 5,
        location: 'Warehouse A - Shelf 2',
      },
      {
        name: 'Wireless Noise-Cancelling Headphones',
        sku: 'AUD-HDPH-003',
        category: 'Audio',
        description:
          'Premium headphones with active noise cancelling and 30-hour battery life.',
        price: 249.99,
        cost: 120.0,
        stockQuantity: 85,
        minimumStock: 20,
        location: 'Warehouse B - Shelf 3',
      },
      {
        name: 'Ergonomic Office Chair',
        sku: 'FUR-CHAIR-004',
        category: 'Furniture',
        description:
          'Lumbar support, breathable mesh, fully adjustable armrests.',
        price: 349.99,
        cost: 180.0,
        stockQuantity: 15,
        minimumStock: 5,
        location: 'Warehouse B - Shelf 4',
      },
      {
        name: 'Mechanical Keyboard (Red Switches)',
        sku: 'KEY-MECH-005',
        category: 'Peripherals',
        description:
          'Tactile typing feedback, RGB backlighting, custom keycaps.',
        price: 99.99,
        cost: 45.0,
        stockQuantity: 120,
        minimumStock: 25,
        location: 'Warehouse A - Shelf 5',
      },
    ];

    for (const p of productsToSeed) {
      const product = productRepository.create(p);
      await productRepository.save(product);
      this.logger.log(`Seeded product: ${p.name} (SKU: ${p.sku})`);
    }
  }

  private async seedCustomers() {
    const customerRepository = this.dataSource.getRepository(Customer);
    const userRepository = this.dataSource.getRepository(User);
    const count = await customerRepository.count();

    if (count > 0) {
      this.logger.log('Customers already exist. Skipping customer seeding.');
      return;
    }

    this.logger.log('No customers found. Seeding default customers...');

    // Find the sales user to assign
    const salesUser = await userRepository.findOne({
      where: { username: 'sales' },
    });

    const customersToSeed = [
      {
        name: 'Bruce Wayne',
        companyName: 'Wayne Enterprises',
        mobile: '9876543200',
        email: 'bruce@waynecorp.com',
        phone: '9876543199',
        address: '1007 Mountain Drive, Gotham City',
        gstNumber: '29ABCDE1234F1Z5',
        customerType: 'Wholesale' as const,
        status: 'Active' as const,
        followUpDate: '2026-09-01',
        notes: 'Key enterprise account. Prefers bulk orders quarterly.',
        balance: 12500.0,
      },
      {
        name: 'Tony Stark',
        companyName: 'Stark Industries',
        mobile: '9876543145',
        email: 'tony@stark.com',
        phone: '9876543142',
        address: '10880 Malibu Point, Malibu, CA',
        gstNumber: '27STARK5678G1Z6',
        customerType: 'Distributor' as const,
        status: 'Active' as const,
        followUpDate: '2026-08-20',
        notes: 'VIP distributor. Requires priority support and custom pricing.',
        balance: 45000.5,
      },
      {
        name: 'Peter Parker',
        companyName: 'Daily Bugle',
        mobile: '9876543135',
        email: 'peter.parker@dailybugle.com',
        phone: '9876543133',
        address: '20 Ingram St, Forest Hills, Queens, NY',
        gstNumber: undefined,
        customerType: 'Retail' as const,
        status: 'Lead' as const,
        followUpDate: '2026-08-15',
        notes:
          'New lead. Interested in bulk laptop purchase. Follow up scheduled.',
        balance: 0.0,
      },
    ];

    for (const c of customersToSeed) {
      const customer = customerRepository.create({
        ...c,
        assignedSalesId: salesUser ? salesUser.id : null,
      });
      await customerRepository.save(customer);
      this.logger.log(`Seeded customer: ${c.name} (${c.companyName})`);
    }
  }
}
