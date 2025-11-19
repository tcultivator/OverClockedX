"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import { promotion_products } from '@/types/promotion_products_types';
import DiscountedProductsUI from '@/utils/PromotionsTypeUI/DiscountedProductsUI';
import FlashSaleUI from '@/utils/PromotionsTypeUI/FlashSaleUI';
import { motion, AnimatePresence } from 'framer-motion'
const TrendingProducts = () => {
    const [promotionProducts, setPromotionProducts] = useState<promotion_products[]>([])
    const images: string[] = [
        "/promotions/pm1.jpg",
        "/promotions/pm2.jpg",
        "/promotions/pm3.jpg",
        "/promotions/pm4.jpg",
        "/promotions/pm5.jpg",
        "/promotions/test.png"
    ];

    function shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
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

    return (
        <section className="p-4 m-auto px-[2px] xl:px-[5%]">
            <div className="w-full">
                <h2 className="text-2xl font-anton text-[40px] text-left  w-max p-2 text-white rounded-t-md">Promotions</h2>
            </div>
            <AnimatePresence mode='wait'>
                {promotionProducts.length > 0 && < div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left side */}
                    <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-1 gap-4">
                        <motion.div className="w-full h-full object-cover rounded-md" key={promotionProducts[0].product_id}
                            initial={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            animate={{ opacity: 1, transitionDuration: .5, scale: 1 }}
                            exit={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            transition={{ duration: .2 }}>
                            {
                                promotionProducts[0].promotion_type == 'FlashSale' ?
                                    <FlashSaleUI promotionProducts={promotionProducts[0]} /> :
                                    <DiscountedProductsUI promotionProducts={promotionProducts[0]} />
                            }

                        </motion.div>

                        {/* On medium screens, show second image on left */}
                        <motion.div className="w-full h-full object-cover rounded-md md:block lg:hidden" key={promotionProducts[1].product_id}
                            initial={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            animate={{ opacity: 1, transitionDuration: .5, scale: 1 }}
                            exit={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            transition={{ duration: .2 }}>
                            {
                                promotionProducts[1].promotion_type == 'FlashSale' ?
                                    <FlashSaleUI promotionProducts={promotionProducts[1]} /> :
                                    <DiscountedProductsUI promotionProducts={promotionProducts[1]} />
                            }

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
                        {promotionProducts.slice(2, 5).map((data, idx) => (

                            <motion.div className="w-full h-full object-cover rounded-md"
                                key={data.product_id}
                                initial={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                                animate={{ opacity: 1, transitionDuration: .5, scale: 1 }}
                                exit={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                                transition={{ duration: .2 }}
                                
                                >
                                {
                                    data.promotion_type == 'FlashSale' ?
                                        <FlashSaleUI promotionProducts={data} /> :
                                        <DiscountedProductsUI promotionProducts={data} />
                                }

                            </motion.div>


                        ))}

                        {/* Only show images[1] on large, since it was already shown on md */}
                        <motion.div className="w-full h-full object-cover rounded-md hidden lg:block" key={promotionProducts[1].product_id}
                            initial={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            animate={{ opacity: 1, transitionDuration: .5, scale: 1 }}
                            exit={{ opacity: 0, transitionDuration: .5, scale: 0.9 }}
                            transition={{ duration: .2 }}>
                            {
                                promotionProducts[1].promotion_type == 'FlashSale' ?
                                    <FlashSaleUI promotionProducts={promotionProducts[1]} /> :
                                    <DiscountedProductsUI promotionProducts={promotionProducts[1]} />
                            }

                        </motion.div>

                    </div>
                </div>}
            </AnimatePresence>
        </section >
    );
};

export default TrendingProducts;
