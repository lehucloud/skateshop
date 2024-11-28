import { orders, Payment, products,payments, stocks, type PayConfSchema } from "@/db/schema"
import { string } from "zod"

import Alipay, { AlipayConfig } from "../alipay"
import IPayment, { PayemntChannel } from "../types"
import WeChatPay, { WeChatPayConfig } from "../wxpay"
import { getOrderByStoreOrderNo, updateOrderByPayStatus } from "./order"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"


export async function getPaymentByStoreId({storeId,channel}:{storeId:string,channel:PayemntChannel}){
    return db.query.payments.findFirst({
        where: and(eq(payments.storeId, storeId),eq(payments.channel, channel),)
    });
}


export default function PaymentFactory(payChannel: Payment): IPayment {

    const conf = payChannel.config as PayConfSchema
    if(!conf){
        throw new Error("Invalid payment config")
    }
    if (payChannel.channel === "wxpay") {

        const wxpayConf:WeChatPayConfig = {
            appId: "",
            mchId: "",
            apiKey: "",
            notifyUrl: ""
        }
        for (const [key, value] of Object.entries(conf)) {
            if(key==="appId"){
                wxpayConf.appId = value as string
            }
            if(key==="mchId"){
                wxpayConf.mchId = value as string
            }
            if(key==="apiKey"){
                wxpayConf.apiKey = value as string
            }
            if(key==="notifyUrl"){
                wxpayConf.notifyUrl = value as string
            }
        }
        return new WeChatPay(wxpayConf)

    } else if(payChannel.channel === "alipay") {

        const alipayConf:AlipayConfig = {
            appId: "",
            privateKey: "",
            alipayPublicKey: "",
            gateway: "",
            notifyUrl: "",
            returnUrl: ""
        }
        for (const [key, value] of Object.entries(conf)) {
            if(key==="appId"){
                alipayConf.appId = value as string
            }
            if(key==="privateKey"){
                alipayConf.privateKey = value as string
            }
            if(key==="alipayPublicKey"){
                alipayConf.alipayPublicKey = value as string
            }
            if(key==="gateway"){
                alipayConf.gateway = value as string
            }
            if(key==="notifyUrl"){
                alipayConf.notifyUrl = value as string
            }
            if(key==="returnUrl"){
                alipayConf.returnUrl = value as string
            }
        }
        return new Alipay(alipayConf)
    }
    throw new Error("Invalid payment channel")
}

/**
 * 支付成功处理
 * @returns 
 */
export async function paySuccess(input:{storeOrderNo:string,thirdPartyOrderNo:string}):  Promise<string>  {


    db.transaction(async (db) => {
        // 获取订单信息
        const order = 
        await db.query.orders.findFirst({
            where: eq(orders.storeOrderNo, input.storeOrderNo),
        });
        if (!order) {
            throw new Error(`Order with storeOrderNo ${input.storeOrderNo} not found`);
        }
        // 更新订单状态
        try {
            await db
            .update(orders)
            .set({
                status:  "success",
                thirdPartyOrderNo: input.thirdPartyOrderNo,
            })
            .where(eq(orders.storeOrderNo, input.storeOrderNo))
        } catch (err) {
            console.error(err)
        }        
        // 更新库存
        order.items?.forEach(async (item) => {

            // if(item.variants){

                //如果是一次买断的商品，则不需要分配账号逻辑

                // 更新库存
                // await db
                // .update(stocks)
                // .set({
                //     quantity: Number(stocks.quantity) - item.quantity,
                // })
                // .where(eq(stocks.productVariantId, item.variant.variantId))

                // // 更新商品销量
                // await db
                // .update(products)
                // .set({
                //     salesVolume: Number(products.salesVolume) + item.quantity,
                // })
                // .where(eq(stocks.productVariantId, item.variant.variantId))

                //分配账号
            // }
            // if(item.options){
            //     // 更新库存
            //     item.options?.forEach(async (option) => {
            //         // await db
            //         // .update(stocks)
            //         // .set({
            //         //     quantity: Number(stocks.quantity) - item.quantity,
            //         // })
            //         // .where(eq(stocks.productVariantId, option.variantId))

            //         // 更新商品销量

            //         //分配账号
            //     })
            // }
        })
    })

    return "success"
}


/**
 * 支付失败处理
 * @returns 
 */
export async function payFail(input:{storeOrderNo:string,reason:string,thirdPartyOrderNo:string}): Promise<string> {

    db.transaction(async (db) => {
        // 获取订单信息
        const order = 
        await db.query.orders.findFirst({
            where: eq(orders.storeOrderNo, input.storeOrderNo),
        });
        if (!order) {
            throw new Error(`Order with storeOrderNo ${input.storeOrderNo} not found`);
        }
        // 更新订单状态
        try {
            await db
            .update(orders)
            .set({
                status:  "fail",
                thirdPartyOrderNo: input.thirdPartyOrderNo,
            })
            .where(eq(orders.storeOrderNo, input.storeOrderNo))
        } catch (err) {
            console.error(err)
        }     
    })
    
    return "success"
}