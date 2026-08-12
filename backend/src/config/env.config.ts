import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  PORT = 8001

  @IsString()
  DB_HOST = 'localhost';

  @IsNumber()
  DB_PORT = 5432;

  @IsString()
  DB_USERNAME = 'erp_admin';

  @IsString()
  DB_PASSWORD = 'erp_password';

  @IsString()
  DB_DATABASE = 'mini_erp_crm';

  @IsString()
  JWT_SECRET = 'super-secret-crm-erp-key-change-in-prod';

  @IsString()
  JWT_EXPIRATION = '1d';
}

export function validate(config: Record<string, any>) {
  const parsedConfig = { ...config };
  if (parsedConfig.PORT !== undefined) {
    parsedConfig.PORT = Number(parsedConfig.PORT);
  }
  if (parsedConfig.DB_PORT !== undefined) {
    parsedConfig.DB_PORT = Number(parsedConfig.DB_PORT);
  }

  const validatedConfig = plainToInstance(EnvironmentVariables, parsedConfig, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
