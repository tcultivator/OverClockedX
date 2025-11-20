"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import { promotion_products } from '@/types/promotion_products_types';
import DiscountedProductsUI from '@/utils/PromotionsTypeUI/DiscountedProductsUI';
import FlashSaleUI from '@/utils/PromotionsTypeUI/FlashSaleUI';
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '../ui/label';
import Image from 'next/image';
const TrendingProducts = () => {
    const [promotionProducts, setPromotionProducts] = useState<promotion_products[]>([])


    // this is the shuffle function to shuffle the display of promotions
    function shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    // this trigger the shuffle function 
    useEffect(() => {

        const interval = setInterval(() => {
            if (promotionProducts.length > 0) {
                setPromotionProducts(prev => shuffleArray(prev));
            }
        }, 8000);

        return () => clearInterval(interval);


    }, []);
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


    // promotion display logic, this perform the logic, that display the dedicated UI for each promotion type, alos display a place holder if the promotions data is less that the required items in layout,
    const getItemOrPlaceholder = (item: promotion_products | undefined) => {
        if (!item) {
            return (
                <Image
                    src={'/NoDataFound.png'}
                    alt=""
                    className="w-full h-full object-cover rounded-md"
                    width={1000}
                    height={1000}
                />
            );
        }

        return item.promotion_type === "FlashSale" ? (
            <FlashSaleUI promotionProducts={item} />
        ) : (
            <DiscountedProductsUI promotionProducts={item} />
        );
    };

    return (
        <section className="p-4 m-auto px-[2px] xl:px-[5%]">
            <div className="w-full">
                <h2 className="text-2xl font-anton text-[40px] text-left  w-max p-2 text-white rounded-t-md">Promotions</h2>
            </div>
            <AnimatePresence mode='wait'>
                {promotionProducts.length > 0 ? < div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left side */}
                    <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-1 gap-4">
                        <motion.div className="w-full h-full object-cover rounded-md" key={"left-big"}
                            initial={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            animate={{ opacity: 1, transitionDuration: .5, scale: 1 }}
                            exit={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            transition={{ duration: .2 }}>
                            {getItemOrPlaceholder(promotionProducts[0])}
                        </motion.div>

                        {/* On medium screens, show second image on left */}

                        <motion.div className="w-full h-full object-cover rounded-md md:block lg:hidden" key={"left-small"}
                            initial={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            animate={{ opacity: 1, transitionDuration: .5, scale: 1 }}
                            exit={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            transition={{ duration: .2 }}>
                            {getItemOrPlaceholder(promotionProducts[1])}
                        </motion.div>


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
                        {[2, 3, 4].map((i) => (
                            <motion.div
                                className="w-full h-full object-cover rounded-md"
                                key={`right-${i}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                {getItemOrPlaceholder(promotionProducts[i])}
                            </motion.div>
                        ))}

                        {/* Only show images[1] on large, since it was already shown on md */}

                        <motion.div className="w-full h-full object-cover rounded-md hidden lg:block" key={"right-duplicate"}
                            initial={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            animate={{ opacity: 1, transitionDuration: .5, scale: 1 }}
                            exit={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            transition={{ duration: .2 }}>
                            {getItemOrPlaceholder(promotionProducts[1])}
                        </motion.div>



                    </div>
                </div> :
                    <div className='w-full flex items-center justfy-center p-5 text-white/50 bg-black rounded-[10px] text-center'>
                        <Label className='text-center m-auto'>NO PROMOTIONS</Label>
                    </div>
                }
            </AnimatePresence>
        </section >
    );
};

export default TrendingProducts;
