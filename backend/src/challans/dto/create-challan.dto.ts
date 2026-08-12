/**
 * CreateChallanDto — Phase 11: Sales Challan Validation
 *
 * - customerId: required, valid UUID
 * - items: at least one item required, each item validated
 * - item.quantity: integer, > 0
 * - item.unitPrice: optional, >= 0
 * - challanNumber: auto-generated, never accepted from the client
 * - Business validation (stock availability, negative-stock prevention)
 *   is enforced in ChallansService, not here.
 */

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsInt,
  Min,
  IsArray,
  ArrayMinSize,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateChallanItemDto {
  // Phase 11: must reference a real product (existence checked in service)
  @IsUUID('4', { message: 'items[].productId: Must be a valid product UUID' })
  @IsNotEmpty({ message: 'items[].productId: Product ID is required' })
  productId: string;

  // Phase 11: integer, strictly > 0
  @IsInt({ message: 'items[].quantity: Quantity must be a whole number' })
  @Min(1, {
    message:
      'items[].quantity: Quantity must be at least 1 (zero and negative values are not valid)',
  })
  quantity: number;

  // Phase 11: unit price — optional override; if provided must be >= 0
  @IsNumber({}, { message: 'items[].unitPrice: Unit price must be a number' })
  @IsOptional()
  @Min(0, {
    message: 'items[].unitPrice: Unit price must be 0 or greater',
  })
  unitPrice?: number;
}

export class CreateChallanDto {
  // Phase 11: customerId — valid UUID, existence validated in service
  @IsUUID('4', { message: 'customerId: Must be a valid customer UUID' })
  @IsNotEmpty({ message: 'customerId: Customer ID is required' })
  customerId: string;

  // Phase 11: notes — optional free text
  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'notes: Notes must not exceed 1000 characters',
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  notes?: string;

  // Phase 11: items array — at least one product is required
  @IsArray({ message: 'items: Must be an array of challan items' })
  @ArrayMinSize(1, {
    message: 'items: At least one item is required to create a challan',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateChallanItemDto)
  items: CreateChallanItemDto[];
}
