import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string,
            role: string
        } & DefaultSession["user"]
    }

    interface User {
        id?: string,
        role?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string,
        role?: string
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
    public async pay(order: PayOrder,client :string):  Promise<PayResponse>
    public async mapay(order:PayOrder): Promise<PayResponse>
    public async h5pay(order:PayOrder): Promise<PayResponse>
    public async pcpay(order:PayOrder): Promise<PayResponse>
}

