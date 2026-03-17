import type { NextApiRequest, NextApiResponse } from 'next';
import { deposit } from '@/modules/transactions/transaction.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { account_id, amount } = req.body;

  if (!account_id || amount === undefined) {
    return res.status(400).json({ error: 'account_id and amount are required' });
  }

  try {
    const result = await deposit({ account_id, amount });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}