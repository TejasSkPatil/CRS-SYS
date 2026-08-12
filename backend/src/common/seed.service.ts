import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    this.logger.log('Checking database and seeding if necessary...');
    await this.seedUsers();
    this.logger.log('Seeding check completed.');
  }

  private async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);
    const count = await userRepository.count();

    if (count > 0) {
      this.logger.log('Users already exist. Skipping user seeding.');
      return;
    }

    this.logger.log('No users found. Seeding default admin user...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const user = userRepository.create({
      username: 'admin',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'admin' as any,
    });
    await userRepository.save(user);
    this.logger.log('Seeded admin user.');
  }
}
