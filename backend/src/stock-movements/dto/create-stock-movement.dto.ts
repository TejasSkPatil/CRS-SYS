/**
 * CreateStockMovementDto — Phase 10: Stock Movement Validation
 *
 * - type: must be exactly 'IN' or 'OUT', nothing else
 * - quantity: integer, > 0 (zero and negatives are invalid for a movement)
 * - Business rule: OUT quantity must not exceed available stock
 *   (enforced in StockMovementsService, not in this DTO)
 */

import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsIn,
  IsUUID,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateStockMovementDto {
  // Phase 10: productId — valid UUID
  @IsUUID('4', { message: 'productId: Must be a valid product UUID' })
  @IsNotEmpty({ message: 'productId: Product ID is required' })
  productId: string;

  // Phase 10: quantity — integer, must be > 0 (0 and negative are invalid)
  @IsInt({ message: 'quantity: Quantity must be a whole number' })
  @Min(1, {
    message:
      'quantity: Movement quantity must be at least 1 (zero and negative quantities are not valid)',
  })
  quantity: number;

  // Phase 10: type — only 'IN' or 'OUT'
  @IsString()
  @IsIn(['IN', 'OUT'], {
    message: "type: Movement type must be exactly 'IN' or 'OUT'",
  })
  type: 'IN' | 'OUT';

  // reference note — optional, max 255 chars
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'reference: Reference note must not exceed 255 characters',
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  reference?: string;
}
