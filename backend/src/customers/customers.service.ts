import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
    user: User,
  ): Promise<Customer> {
    const assignedSalesId =
      user.role === 'sales' ? user.id : createCustomerDto.assignedSalesId;

    const customer = this.customersRepository.create({
      ...createCustomerDto,
      assignedSalesId: assignedSalesId || null,
    });

    return this.customersRepository.save(customer);
  }

  async findAll(user: User): Promise<Customer[]> {
    if (user.role === 'sales') {
      return this.customersRepository.find({
        where: { assignedSalesId: user.id },
        relations: { assignedSales: true },
      });
    }
    return this.customersRepository.find({
      relations: { assignedSales: true },
    });
  }

  async findOne(id: string, user: User): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: { assignedSales: true },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    if (user.role === 'sales' && customer.assignedSalesId !== user.id) {
      throw new NotFoundException(
        `Customer with ID "${id}" not found (unauthorized)`,
      );
    }

    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: CreateCustomerDto,
    user: User,
  ): Promise<Customer> {
    const customer = await this.findOne(id, user);

    Object.assign(customer, updateCustomerDto);
    if (user.role === 'sales') {
      // Force it to remain assigned to the sales user
      customer.assignedSalesId = user.id;
    }

    return this.customersRepository.save(customer);
  }

  async remove(id: string, user: User): Promise<void> {
    const customer = await this.findOne(id, user);
    await this.customersRepository.remove(customer);
  }
}
