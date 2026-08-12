/**
 * CreateCustomerDto — validation Phases 2–8 applied
 *
 * Phase 2: non-blank string guards everywhere
 * Phase 3: name uses IsPersonName (letters + spaces, 2–100)
 * Phase 4: mobile uses IsIndianMobile (+91XXXXXXXXXX)
 * Phase 5: email uses @IsEmail() (strict)
 * Phase 6: GSTIN optional, 15-char Indian format
 * Phase 7: customerType enum, status enum, PIN 6-digits
 * Phase 8: followUpDate must not be in the past
 */

import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsUUID,
  IsIn,
  IsDateString,
  Length,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  IsPersonName,
  IsIndianMobile,
  IsGSTIN,
  IsNotPastDate,
} from '../../common/validators';

const cleanAndFormatIndianMobile = ({ value }: { value: unknown }): unknown => {
  if (typeof value !== 'string') return value;
  let clean = value.replace(/[\s\-\(\)]/g, ''); // Remove spaces, hyphens, parentheses
  if (clean.startsWith('+91')) {
    clean = clean.substring(3);
  }
  return clean;
};

const cleanAndFormatGSTIN = ({ value }: { value: unknown }): unknown => {
  if (typeof value !== 'string') return value;
  let clean = value.replace(/[\s\-]/g, '').toUpperCase();
  if (clean.startsWith('GST') && clean.length === 18) {
    clean = clean.substring(3);
  }
  return clean;
};

export class CreateCustomerDto {
  // Phase 3: name — letters + spaces, 2–100 chars, no numbers/specials
  @IsPersonName()
  @IsNotEmpty({ message: 'name: Name is required' })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  // Phase 2: non-blank string, 2–100 chars
  @IsString()
  @IsNotEmpty({ message: 'companyName: Company name is required' })
  @Length(2, 100, {
    message: 'companyName: Company name must be between 2 and 100 characters',
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  companyName: string;

  // Phase 4: optional Indian mobile +91XXXXXXXXXX
  @IsOptional()
  @Transform(cleanAndFormatIndianMobile)
  @IsIndianMobile()
  mobile?: string;

  // Phase 5: email — strict, required
  @IsEmail(
    {},
    { message: 'email: Must be a valid email address (e.g. user@domain.com)' },
  )
  @IsNotEmpty({ message: 'email: Email is required' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email: string;

  // Phase 4: phone (primary contact) — Indian format
  @Transform(cleanAndFormatIndianMobile)
  @IsIndianMobile({ message: 'phone: Must be a valid Indian number (+91XXXXXXXXXX)' })
  @IsNotEmpty({ message: 'phone: Phone is required' })
  phone: string;

  // Phase 7: address — required, max 500 chars
  @IsString()
  @IsNotEmpty({ message: 'address: Address is required' })
  @MaxLength(500, {
    message: 'address: Address must not exceed 500 characters',
  })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  address: string;

  // Phase 6: GSTIN — optional, exactly 15 chars, Indian alphanumeric format
  @IsOptional()
  @Transform(cleanAndFormatGSTIN)
  @IsGSTIN()
  gstNumber?: string;

  // Phase 7: customer type enum
  @IsIn(['Retail', 'Wholesale', 'Distributor'], {
    message: 'customerType: Must be one of Retail, Wholesale, Distributor',
  })
  @IsOptional()
  customerType?: 'Retail' | 'Wholesale' | 'Distributor';

  // Phase 7: status enum
  @IsIn(['Lead', 'Active', 'Inactive'], {
    message: 'status: Must be one of Lead, Active, Inactive',
  })
  @IsOptional()
  status?: 'Lead' | 'Active' | 'Inactive';

  // Phase 8: follow-up date — valid date, must not be in the past
  @IsOptional()
  @IsDateString(
    {},
    { message: 'followUpDate: Must be a valid ISO date string (e.g. 2026-08-11)' },
  )
  @IsNotPastDate({ message: 'followUpDate: Follow-up date must not be in the past' })
  followUpDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'notes: Notes must not exceed 1000 characters' })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  notes?: string;

  @IsNumber({}, { message: 'balance: Balance must be a number' })
  @IsOptional()
  @Min(0, { message: 'balance: Balance must not be negative' })
  balance?: number;

  @IsUUID('4', { message: 'assignedSalesId: Must be a valid UUID' })
  @IsOptional()
  assignedSalesId?: string;
}
