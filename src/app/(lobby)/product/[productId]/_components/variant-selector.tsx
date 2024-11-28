// components/VariantSelector.tsx
'use client'

import { useState } from "react";
import { AddToCartForm } from "./add-to-cart-form";


interface Sku {
    id: string,
    quantity: number,
    price: string,
    originalPrice: string | null,
    variantCode: string,
    skuCode: string,
}

interface Variant {
    id:string
    variant: {
        id: string;
        name: string;
    }
    productVariantOptions: {
        productVariantId?: string;
        value?: string;
        selected?: boolean;
    }[];
}

function getSelectedValues(variants: Variant[]): string[] {
    return variants.flatMap(variant => 
        variant.productVariantOptions
            .filter(option => option.selected)
            .map(option => option.value)
    ).filter((value): value is string => value !== undefined);
}

export function VariantSelector({
    skus,
    initialSku,
    variants,
    productId
}: {
    skus: Sku[];
    initialSku: Sku;
    variants: Variant[];
    productId: string;
}) {
    const [selectedSku, setSelectedSku] = useState(initialSku);
    const [selectedVariants, setSelectedVariants] = useState(initialSku?.variantCode.split(":") || []);

    variants.find(item => {
        item.productVariantOptions.some(option => {
            selectedVariants?.some(value => {
                if (option.value === value) {
                    option.selected = true;
                }
            })
        })
    });

    // 处理变体选择
    const handleVariantChange = (id: string, value: string) => {

        variants.find(item => {
            if (item.id === id) {
                item.productVariantOptions.forEach(option => {
                    option.selected = false;
                });
            }
            item.productVariantOptions.some(option => {
                if (option.productVariantId === id && option.value === value) {
                    option.selected = true;
                }
            })
        });

        const selectedVariants = getSelectedValues(variants);

        const selectedVariantCode = selectedVariants.join(':');
        setSelectedVariants(selectedVariants);

        const sku = skus.find(sku => {
            if(sku.variantCode === selectedVariantCode){
                return sku;
            }
        });

        if (sku) {
            setSelectedSku(sku);
        }
    };

    return (
        <div className="space-y-4">
            {variants.map((item, index) => (
                <div key={index}>
                    <h3>{item.variant.name}</h3>
                    <div className="flex gap-2">
                        {item.productVariantOptions.map(option => (
                            <button
                                key={option.value}
                                className={`px-4 py-2 border rounded ${option.selected? 'border-yellow-500' : 'border-gray-200'}`}
                                onClick={() => handleVariantChange(item.id, option.value || '')}
                            >
                                {option.value}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            <div>
                <p>Sku: {selectedSku.skuCode}</p>
                <p>Price: ${selectedSku.price}</p>
                <p>Stock: {selectedSku.quantity} available</p>
            </div>
            <AddToCartForm productId={productId} sku={selectedSku} showBuyNow={true} />
        </div>
    );
}