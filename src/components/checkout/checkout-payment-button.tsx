'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Payment } from '@/db/schema';
import { PaymentClient } from '@/lib/types';
import { Icons } from '../icons';

export default function PaymentLinks({ payChannel, storeId }: { payChannel: Payment, storeId: string }) {


    const [deviceInfo, setDeviceInfo] = React.useState({
        isMobile: false,
        client: "pc" as PaymentClient,
    });

    React.useEffect(() => {

        // 在客户端环境下检测设备和浏览器
        const checkDevice = () => {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)

            setDeviceInfo({
                isMobile,
                client: isMobile ? "h5" : "pc",
            })
        }

        checkDevice()
    }, [])

    return (
        <>
            <Link
                key={payChannel.id}
                aria-label="Checkout"
                href={`/checkout/${storeId}/${payChannel.id}/${deviceInfo.client}`}
                className={cn(
                    buttonVariants({
                        size: 'sm',
                    })
                )}
            >
            {payChannel.channel==='wxpay'?(<Icons.wxpay /> ):(<Icons.alipay /> )}   {payChannel.channel}
            </Link>
        </>
    );
}
