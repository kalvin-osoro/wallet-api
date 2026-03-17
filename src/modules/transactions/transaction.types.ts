export interface TransferInput {
  sender_id: number;
  receiver_id: number;
  amount: number;
}

export interface DepositInput {
  account_id: number;
  amount: number;
}