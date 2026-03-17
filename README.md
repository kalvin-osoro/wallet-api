# Wallet API

A wallet API built with Next.js and PostgreSQL that supports deposits and transfers between accounts, with full double-entry bookkeeping via a ledger.

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone git@github-personal:kalvin-osoro/wallet-api.git
cd wallet-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the project:

```env
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
```

Example:

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/wallet_db
```

### 4. Set up the database

Create the database in PostgreSQL:

```bash
psql -U postgres -c "CREATE DATABASE wallet_db;"
```

Run the schema:

```bash
psql -U postgres -d wallet_db -f schema.sql
```

### 5. Run the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

---

## Database Schema

The schema is defined in `schema.sql` and creates three tables:

- `accounts` — stores account holders and their balances
- `transactions` — a header record for each deposit or transfer
- `ledger_entries` — double-entry records (debit/credit) linked to each transaction

---

## API Endpoints

### `POST /api/deposit`

Credits an account with a given amount.

**Request body:**

```json
{
  "account_id": 1,
  "amount": 500
}
```

**Response:**

```json
{
  "message": "Deposit successful",
  "amount": 500,
  "account_id": 1
}
```

---

### `POST /api/transfer`

Transfers an amount from one account to another.

**Request body:**

```json
{
  "sender_id": 1,
  "receiver_id": 2,
  "amount": 100
}
```

**Response:**

```json
{
  "message": "Transfer successful",
  "amount": 100,
  "sender_id": 1,
  "receiver_id": 2
}
```

---

## Example Requests

### Deposit — cURL

```bash
curl -X POST http://localhost:3000/api/deposit \
  -H "Content-Type: application/json" \
  -d '{"account_id": 1, "amount": 500}'
```

### Transfer — cURL

```bash
curl -X POST http://localhost:3000/api/transfer \
  -H "Content-Type: application/json" \
  -d '{"sender_id": 1, "receiver_id": 2, "amount": 100}'
```


## Project Structure

```
wallet-api/
├── pages/
│   └── api/
│       ├── deposit.ts
│       └── transfer.ts
├── src/
│   ├── infrastructure/
│   │   └── db/
│   │       ├── pool.ts
│   │       └── transaction.ts
│   └── modules/
│       ├── accounts/
│       │   ├── account.repository.ts
│       │   └── account.types.ts
│       └── transactions/
│           ├── transaction.repository.ts
│           ├── transaction.service.ts
│           └── transaction.types.ts
├── schema.sql
├── .env
└── README.md
```
