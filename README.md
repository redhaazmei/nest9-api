## NestJS + Postgres + Prisma + Passport JWT (N3P Stack)

[Nest](https://github.com/nestjs/nest) framework TypeScript scaffold.

1. NestJS 9
2. Postgres 14 (Docker)
3. Prisma ORM
4. Passport JWT

## Installation

```bash
$ yarn
```

## Running the app

```bash
# Start db
$ yarn db:up

# Run prisma migration (with existing migration)
$ npx prisma migrate deploy

# Run prisma migration (if using different migration)
$ npx prisma migrate dev

# Dev watch
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
