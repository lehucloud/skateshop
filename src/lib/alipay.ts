import IPayment, { PayOrder, PayResponse } from './types';
import { AlipaySdk, AlipaySdkCommonResult } from 'alipay-sdk';



export interface AlipayConfig {
    appId: string;
    privateKey: string;
    alipayPublicKey: string;
    gateway: string;
    notifyUrl: string;
    returnUrl: string;
}



class Alipay implements IPayment{
    private config: AlipayConfig;


    constructor(config: AlipayConfig) {
        this.config = config;
    }
    public verifySignature(params:any) {
        const alipaySdk = new AlipaySdk({
            appId: this.config.appId,
            privateKey: this.config.privateKey,
            alipayPublicKey: this.config.alipayPublicKey,
            gateway: this.config.gateway,
        });

        return alipaySdk.checkNotifySign(params);
    }
    public pay(order: PayOrder, client: string): Promise<PayResponse<any>> {
        switch (client) {
            case "ma":
                return this.mapay(order);
            case "h5":
                return this.h5pay(order);
            case "pc":
                return this.pcpay(order);
            default:
                return Promise.resolve({
                    success: false,
                    data: null,
                    message: "Invalid client"
                });
        }
    }

    public async mapay(order: PayOrder): Promise<PayResponse<AlipaySdkCommonResult>> {
        const alipaySdk =  new AlipaySdk({
            appId: this.config.appId,
            privateKey: this.config.privateKey,
            alipayPublicKey: this.config.alipayPublicKey,
            gateway: this.config.gateway,
        });
        const result = await alipaySdk.exec("alipay.trade.precreate", {
                bizContent: {
                    out_trade_no: order.orderId,
                    total_amount: order.amount,
                    subject: order.description,
                },
                returnUrl: this.config.returnUrl,
                notifyUrl: this.config.notifyUrl,
        });
        console.log("alipay result::::",result);

        return {
            success: true,
            data: result,
            message: "success",
        };
    }

    public async h5pay(order: PayOrder): Promise<PayResponse<string>> {

        const alipaySdk =  new AlipaySdk({
            appId: this.config.appId,
            privateKey: this.config.privateKey,
            alipayPublicKey: this.config.alipayPublicKey,
            gateway: this.config.gateway,
        });
        const result = await alipaySdk.pageExec("alipay.trade.wap.pay",'GET',{
            bizContent: {
                out_trade_no: order.orderId,
                total_amount: order.amount,
                subject: order.description,
                product_code: "QUICK_WAP_WAY",
                seller_id: "2021004162656572",
            },
            returnUrl: this.config.returnUrl,
            notifyUrl: this.config.notifyUrl,
        });
        console.log("alipay result::::",result);
        
        return {
            success: true,
            data: result,
            message: "success",
        };
    }

    public async pcpay(order: PayOrder): Promise<PayResponse<string>> {
        const alipaySdk =  new AlipaySdk({
            appId: this.config.appId,
            privateKey: this.config.privateKey,
            alipayPublicKey: this.config.alipayPublicKey,
            gateway: this.config.gateway,
        });

        const result = await alipaySdk.pageExec("alipay.trade.page.pay",'GET', {
            bizContent: {
                out_trade_no: order.orderId,
                total_amount: order.amount,
                subject: order.description,
                product_code: "FAST_INSTANT_TRADE_PAY",
            },
            returnUrl: this.config.returnUrl,
            notifyUrl: this.config.notifyUrl,
        });
        console.log("alipay result::::",result);
        return {
            success: true,
            data: result,
            message: "success",
        };
    }
    
}

export default Alipay;