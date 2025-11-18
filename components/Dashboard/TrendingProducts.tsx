"use client"
import React from 'react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
type promotion_products = {
    product_id: string;
    product_name: string;
    product_image: string;
    brand: string;
    price: number;
    start_date: Date;
    end_date: Date;
    value: number;
    promotion_type: string;
}
const TrendingProducts = () => {
    const [promotionProducts, setPromotionProducts] = useState<promotion_products[]>([])
    const images: string[] = [
        "/promotions/pm1.jpg",
        "/promotions/pm2.jpg",
        "/promotions/pm3.jpg",
        "/promotions/pm4.jpg",
        "/promotions/pm5.jpg",
    ];

    useEffect(() => {
        const fetProductsPromotion = async () => {
            try {
                const fetchPromotions = await fetch('/api/fetchPromotionProducts', {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                const fetchPromotionsResult = await fetchPromotions.json()
                if (fetchPromotionsResult.status == 500) return
                setPromotionProducts(fetchPromotionsResult)
            } catch (err) {
                console.error('error fetching Promotion products,', err)
            }

        }
        fetProductsPromotion()
    }, [])

    return (
        <section className="p-4 m-auto px-[2px] md:px-[5%]">
            <div className="w-full">
                <h2 className="text-2xl font-anton text-[40px] text-left  w-max p-2 text-white rounded-t-md">Promotions</h2>
            </div>
            {promotionProducts.length > 0 && < div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left side */}
                <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-1 gap-4">
                    <div className='bg-white/10 rounded-md p-2 flex flex-col justify-between text-white'>
                        <div className='flex justify-between items-center'>
                            <div className='flex gap-1 items-center'>
                                <Label>November</Label>
                                <Label>{promotionProducts[0].promotion_type}</Label>
                            </div>
                            <div className='p-2 bg-red-400 flex items-center justify-center text-white'>
                                <Label>₱{promotionProducts[0].value}<span>OFF</span></Label>
                            </div>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <div>
                                <Image
                                    src={promotionProducts[0].product_image}
                                    alt="Trending Product 2"
                                    className="w-full h-full rounded-md md:block"
                                    width={800}
                                    height={800}
                                />
                            </div>

                            <div>
                                <Label>{promotionProducts[0].brand}</Label>
                                <Label>{promotionProducts[0].product_name}</Label>
                                <Label>{new Intl.NumberFormat('en-PH', {
                                    style: 'currency',
                                    currency: 'PHP',
                                }).format(promotionProducts[0].price)}</Label>

                            </div>
                        </div>
                        <div className='flex flex-col items-center justify-center gap-2'>
                            <Button variant={'secondary'}>Order Now</Button>
                            <Label className='p-1 border-y-[2px] border-white/50 rounded'>https://overclockedx.onrender.com/</Label>
                        </div>
                    </div>

                    {/* On medium screens, show second image on left */}
                    <Image
                        src={images[1]}
                        alt="Trending Product 2"
                        className="w-full h-full object-cover rounded-md md:block lg:hidden"
                        width={800}
                        height={800}
                    />
                </div>

                {/* Right side */}
                <div className="
                    grid 
                    grid-cols-1 
                    md:grid-cols-1 
                    md:grid-rows-3 
                    lg:grid-cols-2 
                    lg:grid-rows-2 
                    gap-4
                ">
                    {/* On medium: show images[2,3,4]; On large: images[1,2,3,4] */}
                    {images.slice(2, 5).map((img, idx) => (
                        <Image
                            key={idx}
                            src={img}
                            alt={`Trending Product ${idx + 3}`}
                            className="w-full h-full object-cover rounded-md"
                            width={800}
                            height={800}
                        />
                    ))}

                    {/* Only show images[1] on large, since it was already shown on md */}
                    <Image
                        src={images[1]}
                        alt="Trending Product 2"
                        className="w-full h-full object-cover rounded-md hidden lg:block"
                        width={800}
                        height={800}
                    />
                </div>
            </div>}
        </section >
    );
};

export default TrendingProducts;
