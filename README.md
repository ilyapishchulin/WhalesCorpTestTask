# Whales Corp Test Task

## Getting started

#### 1. Install dependencies

```
yarn install
```

#### 2. Install postgresql
#### 3. Add url to database in .env DATABASE_URL
#### 4. Create tables with prisma

```
 npx prisma migrate dev --name init
```

#### 5. Add pool address in .env POOL_ADDRESS

## Env variables

| Переменная   | Описание                              |
|--------------|---------------------------------------|
| PORT         | Port for api web server               |
| DATABASE_URL | Link to database with postgreSQL      |
| ENALED_LOGS  | Enable write logs in session          |
| POOL_ADDRESS | Smart contract address in TON network |


## .env example

```
PORT=3000
ENALED_LOGS=true
DATABASE_URL="postgresql://postgres:1234@localhost:5433/postgres"
POOL_ADDRESS="EQBI-wGVp_x0VFEjd7m9cEUD3tJ_bnxMSp0Tb9qz757ATEAM"
```
