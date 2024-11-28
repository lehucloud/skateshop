import { Payment } from '@/db/schema';
import PaymentFactory, { getPaymentByStoreId, payFail, paySuccess } from '@/lib/actions/payments';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const {storeId} = req.query
    

    const paymentChannel = await getPaymentByStoreId({storeId:storeId as string,channel:"alipay"})

    const payment = PaymentFactory(paymentChannel as Payment);

    if (req.method === 'POST') {

        // const isValidSignature = payment.verifySignature(req.body);
        // if (!isValidSignature) {
        //     return res.status(400).json({ message: 'Invalid signature' });
        // }

        const { out_trade_no, trade_status } = req.body;

        if (trade_status === 'TRADE_SUCCESS') {
            paySuccess({storeOrderNo: out_trade_no, thirdPartyOrderNo: out_trade_no})
            res.status(200).json({ message: 'Payment successful' });
        } else {
            payFail({storeOrderNo: out_trade_no,reason:trade_status, thirdPartyOrderNo: out_trade_no})
            res.status(200).json({ message: 'Payment not successful' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}