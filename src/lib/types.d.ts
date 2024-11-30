import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";


declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string,
            role: string
        } & DefaultSession["user"]
    }

    interface User {
        id?: string,
        role?: string,
        emailVerified?: Date
        phoneVerified?: Date
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id?: string;
        role?: string;
        emailVerified?: Date
        phoneVerified?: Date
    }
}

export type PaymentClient = "pc"| "h5" | "ftf";

export type PayemntChannel = "wxpay" | "alipay" 

export type PayResponse<T> = {
    success: boolean,
    data: T,
    message: string
}

export type PayOrder = {
    orderId: string,
    amount: string,
    description: string
}

export default interface IPayment {
    public async verifySignature(params:any): Boolean
    public async pay(order: PayOrder,client :string):  Promise<PayResponse>
    public async mapay(order:PayOrder): Promise<PayResponse>
    public async h5pay(order:PayOrder): Promise<PayResponse>
    public async pcpay(order:PayOrder): Promise<PayResponse>
}

