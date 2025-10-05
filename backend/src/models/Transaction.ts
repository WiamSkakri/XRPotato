// models/Transaction.ts
interface Transaction {
  id: string;
  paper_id: string;
  reader_id: string;
  amount_xrp: number;
  payment_method: PaymentMethod;
  xrpl_tx_hash?: string;
  stripe_payment_intent_id?: string;
  status: TransactionStatus;
  created_at: Date;
}

enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

enum PaymentMethod {
  XRP_DIRECT = 'xrp_direct',
  STRIPE_CARD = 'stripe_card',
  INSTITUTIONAL = 'institutional'
}