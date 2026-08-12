import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ChallansService } from './challans.service';
import { CreateChallanDto } from './dto/create-challan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Challan } from './entities/challan.entity';

@Controller('challans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChallansController {
  constructor(private readonly challansService: ChallansService) {}

  @Post()
  @Roles('admin', 'sales')
  async create(
    @Body() createChallanDto: CreateChallanDto,
    @GetUser() user: User,
  ): Promise<Challan> {
    return this.challansService.create(createChallanDto, user);
  }

  @Get()
  @Roles('admin', 'sales', 'warehouse', 'accounts')
  async findAll(@GetUser() user: User): Promise<Challan[]> {
    return this.challansService.findAll(user);
  }

  @Get(':id')
  @Roles('admin', 'sales', 'warehouse', 'accounts')
  async findOne(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Challan> {
    return this.challansService.findOne(id, user);
  }

  @Put(':id/confirm')
  @Roles('admin', 'sales')
  async confirm(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Challan> {
    return this.challansService.confirm(id, user);
  }

  @Put(':id/deliver')
  @Roles('admin', 'sales', 'warehouse')
  async deliver(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Challan> {
    return this.challansService.deliver(id, user);
  }

  @Put(':id/invoice')
  @Roles('admin', 'sales', 'accounts')
  async invoice(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Challan> {
    return this.challansService.invoice(id, user);
  }

  @Put(':id/cancel')
  @Roles('admin', 'sales', 'warehouse', 'accounts')
  async cancel(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Challan> {
    return this.challansService.cancel(id, user);
  }
}
