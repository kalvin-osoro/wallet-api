import { PoolClient } from 'pg';
import { Account } from './account.types';

export async function findByIdForUpdate(
  client: PoolClient,
  id: number
): Promise<Account | null> {
  const res = await client.query(
    'SELECT * FROM accounts WHERE id=$1 FOR UPDATE',
    [id]
  );
  return res.rows[0] || null;
}

// Read-only fetch, no lock
export async function findById(
  client: PoolClient,
  id: number
): Promise<Account | null> {
  const res = await client.query<Account>(
    'SELECT * FROM accounts WHERE id = $1',
    [id]
  );
  return res.rows[0] || null;
}


export async function debit(
  client: PoolClient,
  id: number,
  amount: number
): Promise<void> {
  await client.query(
    'UPDATE accounts SET balance = balance - $1 WHERE id=$2',
    [amount, id]
  );
}

export async function credit(
  client: PoolClient,
  id: number,
  amount: number
): Promise<void> {
  await client.query(
    'UPDATE accounts SET balance = balance + $1 WHERE id=$2',
    [amount, id]
  );
}