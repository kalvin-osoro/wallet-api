import type { NextApiRequest, NextApiResponse } from 'next';
import { transfer } from '@/modules/transactions/transaction.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sender_id, receiver_id, amount } = req.body;

    if (!sender_id || !receiver_id || amount === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

  try {
    const result = await transfer({ sender_id, receiver_id, amount });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}