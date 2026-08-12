/**
 * CreateProductDto — Phase 9: Product & Numeric Validation
 *
 * - name: required, 2–100 chars, trimmed
 * - sku: required, 1–50 chars, alphanumeric + hyphen/underscore only
 * - price / cost: numeric, >= 0 (zero allowed)
 * - stockQuantity: integer, >= 0 (zero allowed, negative forbidden)
 * - minimumStock: integer, >= 0 (zero allowed)
 */

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Length,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  // Phase 9: name — required, trimmed, 2–100 chars
  @IsString()
  @IsNotEmpty({ message: 'name: Product name is required' })
  @Length(2, 100, {
    message: 'name: Product name must be between 2 and 100 characters',
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  // Phase 9: SKU — required, 1–50 chars, alphanumeric + - _
  @IsString()
  @IsNotEmpty({ message: 'sku: SKU is required' })
  @Length(1, 50, { message: 'sku: SKU must be between 1 and 50 characters' })
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'sku: SKU must contain only letters, digits, hyphens, and underscores',
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  sku: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message: 'description: Description must not exceed 500 characters',
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, {
    message: 'category: Category must not exceed 100 characters',
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  category?: string;

  // Phase 9: price — numeric, >= 0 (zero is valid)
  @IsNumber({}, { message: 'price: Price must be a number' })
  @Min(0, { message: 'price: Price must be 0 or greater (negative values are not allowed)' })
  price: number;

  // Phase 9: cost — numeric, >= 0
  @IsNumber({}, { message: 'cost: Cost must be a number' })
  @Min(0, { message: 'cost: Cost must be 0 or greater (negative values are not allowed)' })
  cost: number;

  // Phase 9: stockQuantity — integer, >= 0 (NEVER negative)
  @IsInt({ message: 'stockQuantity: Stock quantity must be a whole number' })
  @IsOptional()
  @Min(0, {
    message:
      'stockQuantity: Stock quantity must be 0 or greater (negative stock is not allowed)',
  })
  stockQuantity?: number;

  // Phase 9: minimumStock — integer, >= 0
  @IsInt({ message: 'minimumStock: Minimum stock must be a whole number' })
  @IsOptional()
  @Min(0, {
    message:
      'minimumStock: Minimum stock must be 0 or greater (negative values are not allowed)',
  })
  minimumStock?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100, {
    message: 'location: Location must not exceed 100 characters',
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  location?: string;
}
