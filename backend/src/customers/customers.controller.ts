import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Customer } from './entities/customer.entity';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles('admin', 'sales')
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @GetUser() user: User,
  ): Promise<Customer> {
    return this.customersService.create(createCustomerDto, user);
  }

  @Get()
  @Roles('admin', 'sales', 'accounts')
  async findAll(@GetUser() user: User): Promise<Customer[]> {
    return this.customersService.findAll(user);
  }

  @Get(':id')
  @Roles('admin', 'sales', 'accounts')
  async findOne(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Customer> {
    return this.customersService.findOne(id, user);
  }

  @Put(':id')
  @Roles('admin', 'sales')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: CreateCustomerDto,
    @GetUser() user: User,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto, user);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.customersService.remove(id, user);
  }
}
