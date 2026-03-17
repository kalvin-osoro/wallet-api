import { PoolClient } from 'pg';

interface RecordTransactionInput {
  sender_id: number | null;  // null for deposits
  receiver_id: number;
  amount: number;
  type: 'transfer' | 'deposit';
}

export async function recordTransaction(
  client: PoolClient,
  input: RecordTransactionInput
): Promise<void> {
  const { sender_id, receiver_id, amount, type } = input;
  await client.query(
    `INSERT INTO transactions (sender_id, receiver_id, amount, type)
     VALUES ($1, $2, $3, $4)`,
    [sender_id, receiver_id, amount, type]
  );
}