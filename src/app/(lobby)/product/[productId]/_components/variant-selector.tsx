// components/VariantSelector.tsx
'use client'

import { useState } from "react";
import { AddToCartForm } from "./add-to-cart-form";

interface Variant {
    id: string;
    name: string;
    attributes: {
        size?: string;
        color?: string;
    };
    price: number;
    stock: number;
}

export function VariantSelector({
    variants,
    initialVariant,
    productId
}: {
    variants: Variant[];
    initialVariant: Variant;
    productId: string;
}) {
    const [selectedVariant, setSelectedVariant] = useState(initialVariant);
    const [selectedAttributes, setSelectedAttributes] = useState(initialVariant.attributes);

    // 处理属性选择
    const handleAttributeChange = (attribute: string, value: string) => {
        const newAttributes = { ...selectedAttributes, [attribute]: value };
        setSelectedAttributes(newAttributes);

        // 找到匹配的变体
        // const matchingVariant = variants.find(variant =>
        //     Object.entries(newAttributes).every(([key, value]) =>
        //         variant.attributes[key] === value
        //     )
        // );

        // if (matchingVariant) {
        //     setSelectedVariant(matchingVariant);
        // }
    };

    return (
        <div className="space-y-4">
            {/* 尺寸选择 */}
            {variants.some(v => v.attributes.size) && (
                <div>
                    <h3>Size</h3>
                    <div className="flex gap-2">
                        {Array.from(new Set(variants.map(v => v.attributes.size))).map(size => (
                            <button
                                key={size}
                                className={`px-4 py-2 border rounded ${selectedAttributes.size === size ? 'border-black' : 'border-gray-200'
                                    }`}
                                // onClick={() => handleAttributeChange('size', size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 颜色选择 */}
            {variants.some(v => v.attributes.color) && (
                <div>
                    <h3>Color</h3>
                    <div className="flex gap-2">
                        {Array.from(new Set(variants.map(v => v.attributes.color))).map(color => (
                            <button
                                key={color}
                                className={`w-8 h-8 rounded-full ${selectedAttributes.color === color ? 'ring-2 ring-black' : ''
                                    }`}
                                style={{ backgroundColor: color }}
                                // onClick={() => handleAttributeChange('color', color)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 价格和库存显示 */}
            <div>
                <p>Price: ${selectedVariant.price}</p>
                <p>Stock: {selectedVariant.stock} available</p>
            </div>
            <AddToCartForm productId={productId} showBuyNow={true} />
        </div>
    );
}