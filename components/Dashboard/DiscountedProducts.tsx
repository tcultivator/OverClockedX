"use client"
import React, { useEffect, useState } from 'react';
import { promotion_products } from '@/types/promotion_products_types';
import { Label } from '../ui/label';
import Image from 'next/image';

const DiscountedProducts = () => {
    const [promotionProducts, setPromotionProducts] = useState<promotion_products[]>([]);

    useEffect(() => {
        const fetProductsPromotion = async () => {
            try {
                const fetchPromotions = await fetch('/api/fetchPromotionProducts', {
                    method: 'GET',
                    headers: { 'Content-type': 'application/json' },
                });
                const fetchPromotionsResult = await fetchPromotions.json();
                if (fetchPromotionsResult.status === 500) return;
                setPromotionProducts(fetchPromotionsResult);
            } catch (err) {
                console.error('error fetching Promotion products,', err);
            }
        };
        fetProductsPromotion();
    }, []);

    return (
        <div className="p-4 m-auto w-[90%] sm:w-[80%] md:w-[80%] xl:w-[90%] lg:w-[95%] px-[2px] xl:px-[5%]">
            <div className="w-full">
                {promotionProducts.length > 0 && <h2 className="text-2xl font-orbitron font-bold text-[30px] text-left w-max p-2 text-black rounded-t-md">
                    SALES
                </h2>}
            </div>

            <div className="relative">

                {/* LEFT BLUR */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent z-10"></div>

                {/* RIGHT BLUR */}
                <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10"></div>

                {/* HORIZONTAL SCROLL WITHOUT SCROLLBAR */}
                <div className="overflow-x-auto no-scrollbar">
                    <div className="flex gap-5">
                        {promotionProducts.map((data, index) => (
                            <div
                                key={index}
                                className="bg-white p-2 rounded relative
                                           flex-shrink-0
                                           w-[48%] sm:w-[45%] md:w-[30%] lg:w-[22%] xl:w-[16%]"
                            >
                                <Label className="absolute top-2 left-2 bg-[#e31612] p-2 text-white rounded">
                                    {data.promotion_type}
                                </Label>

                                <Image
                                    src={data.product_image}
                                    alt=""
                                    width={500}
                                    height={500}
                                    className="aspect-square"
                                />

                                <div className="flex flex-col px-2 gap-1">
                                    <Label className="text-[13px] text-black/50">{data.brand}</Label>
                                    <Label>{data.product_name}</Label>

                                    <Label>
                                        <span className="text-[#e31612]">
                                            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
                                                .format(data.price - data.value)}
                                        </span>
                                        <span className="line-through text-black/40 text-[12px] ml-2">
                                            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
                                                .format(data.price)}
                                        </span>
                                    </Label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscountedProducts;
