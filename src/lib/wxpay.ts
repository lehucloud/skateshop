import axios from 'axios';
import crypto from 'crypto';
import IPayment, { PayOrder, PayResponse } from './types';


export  interface WeChatPayConfig  {
    appId: string,
    mchId: string,
    apiKey: string,
    notifyUrl: string
}

class WeChatPay implements IPayment {

    private config: WeChatPayConfig;

    constructor(config: WeChatPayConfig) {
        this.config = config;
    }
    public pay(order: PayOrder, client: string): Promise<PayResponse<any>> {
        throw new Error('Method not implemented.');
    }
    public mapay(order: PayOrder): Promise<any> {
        throw new Error('Method not implemented.');
    }
    public h5pay(order: PayOrder): Promise<any> {
        throw new Error('Method not implemented.');
    }
    public pcpay(order: PayOrder): Promise<any> {
        throw new Error('Method not implemented.');
    }

    
}

export default WeChatPay;