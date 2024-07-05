import { DatabaseInstance } from '~/database/database.services';
import { PaymentResultReqQuery } from '../payment/requests';

class TransactionService {
  async createTransaction(
    vnpayResponseNew: Omit<PaymentResultReqQuery, 'vnp_SecureHash' | 'vnp_SecureHashType'>,
  ) {
    const {
      vnp_Amount,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CardType,
      vnp_OrderInfo,
      vnp_PayDate,
      vnp_TransactionNo,
      vnp_TxnRef,
    } = vnpayResponseNew;
    const transaction = await DatabaseInstance.getPrismaInstance().transaction.create({
      data: {
        order_id: Number(vnp_TxnRef),
        amount: Number(vnp_Amount),
        bank_code: vnp_BankCode as string,
        bank_tran_no: vnp_BankTranNo as string,
        card_type: vnp_CardType as string,
        transaction_no: Number(vnp_TransactionNo),
        description: vnp_OrderInfo as string,
        time_stamp: vnp_PayDate as string,
      },
    });
    return transaction;
  }
}

const transactionService = new TransactionService();

export default transactionService;
