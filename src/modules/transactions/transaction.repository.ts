import { PoolClient } from 'pg';

type TransactionType = 'transfer' | 'deposit';

export async function recordTransaction(
  client: PoolClient,
  input: {
    type: TransactionType;
    sender_id: number | null;
    receiver_id: number;
    amount: number;
  }
): Promise<void> {
  const { type, sender_id, receiver_id, amount } = input;

  const transaction = await client.query<{ id: number }>(
    `INSERT INTO transactions (sender_id, receiver_id, type, amount)
     VALUES ($1, $2, $3, $4) RETURNING id`,
  [sender_id, receiver_id, type, amount]
  );
  const transaction_id = transaction.rows[0].id;

  await client.query(
    `INSERT INTO ledger_entries (transaction_id, account_id, entry_type, amount)
     VALUES ($1, $2, 'credit', $3)`,
    [transaction_id, receiver_id, amount]
  );

  if (sender_id !== null) {
    await client.query(
      `INSERT INTO ledger_entries (transaction_id, account_id, entry_type, amount)
       VALUES ($1, $2, 'debit', $3)`,
      [transaction_id, sender_id, amount]
    );
  }
}