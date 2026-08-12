import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors();

  // Phase 1 — Validation Architecture
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // strip unknown properties
      forbidNonWhitelisted: true,    // reject requests with unknown fields
      transform: true,               // auto-convert primitives (string → number)
      exceptionFactory: (errors) => {
        // Recursively flatten nested validation errors (e.g. ValidateNested items[])
        const flatten = (errs: typeof errors, prefix = ''): string[] =>
          errs.flatMap((err) => {
            const prop = prefix ? `${prefix}.${err.property}` : err.property;
            const own = Object.values(err.constraints || {}).map(
              (msg) => `${prop}: ${msg}`,
            );
            const nested = err.children?.length
              ? flatten(err.children, prop)
              : [];
            return [...own, ...nested];
          });

        return new BadRequestException({
          statusCode: 400,
          error: 'Validation Error',
          messages: flatten(errors),
        });
      },
    }),
  );

  const port = process.env.PORT || 8001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
