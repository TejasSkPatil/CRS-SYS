/**
 * Common reusable validation helpers — Phases 2–8
 *
 * Usage: import individual decorators from this file and apply them to DTO
 * properties.  All decorators compose class-validator primitives so that
 * NestJS ValidationPipe handles them without extra configuration.
 */

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// ─── Phase 2: Non-blank string helper ────────────────────────────────────────
/** Returns true only when the value is a non-empty, non-whitespace string. */
export function isNonBlankString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

// ─── Phase 3: Person/Company name (alpha + spaces, 2–100 chars) ──────────────
@ValidatorConstraint({ name: 'IsPersonName', async: false })
export class IsPersonNameConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    // 2–100 chars, only letters and spaces
    return /^[A-Za-z\s]{2,100}$/.test(trimmed);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must contain only letters and spaces (2–100 characters)`;
  }
}

export function IsPersonName(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsPersonNameConstraint,
    });
  };
}

// ─── Phase 4: Indian mobile (exactly 10 digits starting with 6–9) ──────────────
@ValidatorConstraint({ name: 'IsIndianMobile', async: false })
export class IsIndianMobileConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    return /^[6-9]\d{9}$/.test(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be exactly 10 digits (starting with 6–9)`;
  }
}

export function IsIndianMobile(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsIndianMobileConstraint,
    });
  };
}

// ─── Phase 6: GSTIN (optional, exactly 15 alphanumeric chars) ────────────────
@ValidatorConstraint({ name: 'IsGSTIN', async: false })
export class IsGSTINConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value === null || value === undefined || value === '') return true; // optional
    if (typeof value !== 'string') return false;
    const upper = value.toUpperCase().trim();
    return /^[A-Z0-9]{15}$/.test(upper);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be exactly 15 alphanumeric characters`;
  }
}

export function IsGSTIN(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsGSTINConstraint,
    });
  };
}

// ─── Phase 7: PIN code (exactly 6 digits) ────────────────────────────────────
@ValidatorConstraint({ name: 'IsIndianPIN', async: false })
export class IsIndianPINConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value === null || value === undefined) return true; // used as optional outside
    if (typeof value !== 'string') return false;
    return /^\d{6}$/.test(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be exactly 6 digits (e.g. 411001)`;
  }
}

export function IsIndianPIN(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsIndianPINConstraint,
    });
  };
}

// ─── Phase 8: Follow-up date must not be in the past ─────────────────────────
@ValidatorConstraint({ name: 'IsNotPastDate', async: false })
export class IsNotPastDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value === null || value === undefined || value === '') return true; // optional
    const input = new Date(value as string);
    if (isNaN(input.getTime())) return false;

    // Compare dates only (ignore time) using UTC to avoid timezone bugs
    const todayStr = new Date().toISOString().slice(0, 10);
    const inputStr = input.toISOString().slice(0, 10);
    return inputStr >= todayStr;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must not be in the past (today or future dates only)`;
  }
}

export function IsNotPastDate(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsNotPastDateConstraint,
    });
  };
}
