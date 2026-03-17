import { withTransaction } from '@/infrastructure/db/transaction';
import * as accountRepo from '../accounts/account.repository';
import * as transactionRepo from './transaction.repository';
import { DepositInput, TransferInput } from './transaction.types';

export async function transfer(input: TransferInput) {
  const { sender_id, receiver_id, amount } = input;

  if (!sender_id || !receiver_id) throw new Error('sender_id and receiver_id are required');
  if (typeof amount !== 'number' || isNaN(amount)) throw new Error('Amount must be a number');
  if (amount <= 0) throw new Error('Amount must be greater than zero');
  if (sender_id === receiver_id) throw new Error('Sender and receiver cannot be the same account');

  return withTransaction(async (client) => {

    const [first, second] = sender_id < receiver_id
      ? [sender_id, receiver_id]
      : [receiver_id, sender_id];

    await accountRepo.findByIdForUpdate(client, first)

    const sender = await accountRepo.findByIdForUpdate(client, second);
    const receiver = sender_id === first
      ? await accountRepo.findByIdForUpdate(client, receiver_id)
      : await accountRepo.findByIdForUpdate(client, sender_id);

    const senderAccount = await accountRepo.findByIdForUpdate(client, sender_id);
    const receiverAccount = await accountRepo.findByIdForUpdate(client, receiver_id);

    if (!senderAccount) throw new Error(`Sender account ${sender_id} not found`);
    if (!receiverAccount) throw new Error(`Receiver account ${receiver_id} not found`);
    if (senderAccount.balance < amount) throw new Error('Insufficient balance');


    await accountRepo.debit(client, sender_id, amount);
    await accountRepo.credit(client, receiver_id, amount);

    await transactionRepo.recordTransaction(client, {
      sender_id,
      receiver_id,
      amount,
      type: 'transfer',
    });

    return { message: 'Transfer successful', amount, sender_id, receiver_id };
  });
}

export async function deposit(input: DepositInput) {
  const { account_id, amount } = input;

  if (!account_id) throw new Error('account_id is required');
  if (typeof amount !== 'number' || isNaN(amount)) throw new Error('Amount must be a number');
  if (amount <= 0) throw new Error('Amount must be greater than zero');
  if (!Number.isFinite(amount)) throw new Error('Amount must be a finite number');

  return withTransaction(async (client) => {
    const account = await accountRepo.findByIdForUpdate(client, account_id);
    if (!account) throw new Error(`Account ${account_id} not found`);

    await accountRepo.credit(client, account_id, amount);

    await transactionRepo.recordTransaction(client, {
      sender_id: null,
      receiver_id: account_id,
      amount,
      type: 'deposit',
    });

    return { message: 'Deposit successful', amount, account_id };
  });
}