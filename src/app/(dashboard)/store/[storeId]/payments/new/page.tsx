import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Payment, NewPayment, payChannelEnum } from '@/db/schema/payments';
// import { createPayment } from '@/lib/api'; // Assume you have an API function to create a payment

const NewPaymentPage = () => {
    const router = useRouter();
    const { storeId } = router.query;
    const [formData, setFormData] = useState<NewPayment>({
        id: '',
        storeId: storeId as string,
        channel: 'wxpay',
        icon: '',
        config: null,
        stripeAccountId: '',
        stripeAccountCreatedAt: null,
        stripeAccountExpiresAt: null,
        detailsSubmitted: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev:any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // await createPayment(formData);
            router.push(`/store/${storeId}/payments`);
        } catch (error) {
            console.error('Failed to create payment', error);
        }
    };

    return (
        <div>
            <h1>新增付款方式</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="channel">支付渠道</label>
                    <select name="channel" value={formData.channel} onChange={handleChange}>
                        {payChannelEnum.enumValues.map((channel:any) => (
                            <option key={channel} value={channel}>
                                {channel}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="icon">图标</label>
                    <input type="text" name="icon" value={formData.icon} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="stripeAccountId">Stripe 账户 ID</label>
                    <input type="text" name="stripeAccountId" value={formData.stripeAccountId} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="detailsSubmitted">详情已提交</label>
                    <input type="checkbox" name="detailsSubmitted" checked={formData.detailsSubmitted} onChange={(e) => setFormData((prev:any) => ({ ...prev, detailsSubmitted: e.target.checked }))} />
                </div>
                <button type="submit">提交</button>
            </form>
        </div>
    );
};

export default NewPaymentPage;