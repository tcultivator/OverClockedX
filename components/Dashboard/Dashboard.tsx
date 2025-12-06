"use client";
import React from 'react'
import { LuCircleChevronLeft } from "react-icons/lu";
import { LuCircleChevronRight } from "react-icons/lu";
import { useEffect, useState } from 'react';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { ProductsType } from '@/types/ProductTypes';
import { Skeleton } from "@/components/ui/skeleton"
import Image from 'next/image';
import { useRouter } from 'next/navigation';


//zustand
// shared state
import { useCartStore } from '@/stores/cartStore';
import { useUserStore } from '@/stores/userStore';
import { useToast } from '@/stores/toastStore';
import { useFeatureProductsStore } from '@/stores/featuredProductsStore';

//this is the framer motion import, this allow to have an animation
import { motion, AnimatePresence } from 'framer-motion'
import { Label } from '../ui/label';


const Dashboard = () => {
    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const featuredProducts = useFeatureProductsStore((state)=>state.featuredProducts)
    const setFeaturedProducts = useFeatureProductsStore((state)=>state.setFeaturedProducts)
    
    const addToCart = useCartStore((state) => state.addToCart)
    const user = useUserStore((state) => state.user)
    const toastState = useToast((state) => state.toastState)



    useEffect(() => {
        const getFeaturedProductsFunc = async () => {
            const getFeaturedProducts = await fetch('/api/featuredProducts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const response = await getFeaturedProducts.json()
            setFeaturedProducts(response)

        }
        getFeaturedProductsFunc()

    }, [])


    function prevSlide() {

        setCurrent((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1));

    };
    function nextSlide() {

        setCurrent((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));

    };


    useEffect(() => {
        const interval = setInterval(() => {
            if (featuredProducts.length > 0) {
                nextSlide();
            }
        }, 5000);

        return () => clearInterval(interval);
    });

    function SelectCategories(category: string): void {
        router.push(`/categories/${category}`);
    }
    return (
        <div className="flex flex-col gap-5">
            <div className='flex flex-col px-[2px] gap-[2px] sm:px-2 sm:gap-2 md:flex-row lg:flex-row  '>
                <div className='text-black w-full gap-1 flex flex-col-reverse items-center bg-white py-7 rounded w-[85%] mx-auto px-[3%] relative sm:py-3 md:w-[85%] py-3 sm:flex-row 2xl:ww-[85%] py-3'>
                    <AnimatePresence mode='wait'>
                        {featuredProducts.length > 0 ?
                            (<motion.div className='flex flex-col w-full lg:w-[50%]'
                                key={featuredProducts[current].id}
                                initial={{ opacity: 0, y: -100, animationDuration: .5 }}
                                animate={{ opacity: 1, y: 0, animationDuration: .5 }}
                                exit={{ opacity: 0, animationDuration: .5 }}>


                                <label className='text-[15px] font-orbitron md:text-[14px] lg:text-[23px] xl:text-[33px] 2xl:text-[43px] overflow-hidden line-clamp-2'>{featuredProducts[current].product_name}</label>
                                <label className='font-light text-[13px] md:text-[10px] lg:text-[12px] xl:text-[14px] 2xl:text-[15px] overflow-hidden line-clamp-3'>
                                    {featuredProducts[current].description}
                                </label>
                                <label className='text-[15px] font-orbitron md:text-[15px] lg:text-[20px] xl:text-[25px] 2xl:text-[30px]'>
                                    {new Intl.NumberFormat('en-PH', {
                                        style: 'currency',
                                        currency: 'PHP',
                                    }).format(featuredProducts[current].price)}
                                </label>
                                <div className="mt-4 flex w-full flex-col md:w-[90%] gap-1 sm:flex-row">
                                    <button onClick={() => router.push(`/product/${featuredProducts[current].product_id}`)} className='w-full sm:w-[160px] rounded-[5px] p-4 text-[13px] bg-black text-white'>BUY</button>

                                    <button
                                        disabled={toastState}
                                        onClick={() => {
                                            addToCart({
                                                id: featuredProducts[current].id,
                                                email: user?.email,
                                                product_id: featuredProducts[current].product_id,
                                                product_name: featuredProducts[current].product_name,
                                                product_image: featuredProducts[current].product_image,
                                                price: featuredProducts[current].price,
                                                stocks: featuredProducts[current].stocks,
                                                quantity: 1,
                                                value: featuredProducts[current].value
                                            })
                                        }}

                                        className="w-full sm:w-[160px] rounded-[5px] p-4 text-[13px] bg-white text-black border border-black/50 flex items-center justify-center gap-1">
                                        <AiOutlineShoppingCart className='text-[15px]' />  ADD TO CART
                                    </button>
                                </div>

                            </motion.div>) :
                            (
                                <div className='flex flex-col gap-2 w-full lg:w-[50%]'>
                                    <Skeleton className=' bg-black/20 text-[15px] h-[100px] w-full rounded-xl font-anton md:text-[20px] lg:text-[30px] xl:text-[40px] 2xl:text-[50px]' />
                                    <Skeleton className='bg-black/20 font-thin h-[70px] w-full text-[11px] md:text-[12px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]' />
                                    <Skeleton className=' bg-black/20 text-[15px] h-[50px] w-full font-anton md:text-[15px] lg:text-[20px] xl:text-[25px] 2xl:text-[30px]' />
                                    <div className="mt-4 flex flex-col gap-1 sm:flex-row">
                                        <Skeleton className='bg-black/20 h-[50px] w-full text-[10px] py-2 w-full text-black   rounded-[10px] md:text-[12px]  rounded-[5px]' />
                                        <Skeleton className='bg-black/20 h-[50px] w-full text-[10px] py-2 w-full flex flex-col items-center justify-center text-black  rounded-[10px] md:text-[12px] rounded-[5px] lg:flex-row ' />
                                    </div>

                                </div>
                            )
                        }
                    </AnimatePresence>
                    <AnimatePresence mode='wait'>
                        {featuredProducts.length > 0 ? (

                            <motion.div
                                key={featuredProducts[current].id}
                                initial={{ opacity: 0, animationDuration: .5 }}
                                animate={{ opacity: 1, animationDuration: .5 }}
                                exit={{ opacity: 0, animationDuration: .5 }}
                                className="relative overflow-hidden w-full lg:w-[50%]">
                                <div className="flex relative w-full transition-transform duration-700 ease-in-out ">
                                    <div className='w-full max-w-full flex-shrink-0 object-contain relative aspect-square p-5' >
                                        <Image

                                            src={featuredProducts[current].product_image}
                                            alt=''
                                            width={1000}
                                            height={1000}
                                            className='w-full max-w-full flex-shrink-0 object-contain ' />
                                        {featuredProducts[current].value != null &&
                                            <div className="absolute top-8 right-1 rotate-[45deg]">
                                                <div className={`${featuredProducts[current].promotion_type == 'FlashSale' ? 'bg-[#FFD477]' : 'bg-[#e31612]'} rounded-tl-[45%] rounded-bl-[45%] rounded-tr-xl rounded-br-xl shadow-md`}>
                                                    <div className="relative pl-8 pr-5 py-3 flex items-center">
                                                        <Label className="text-white font-semibold flex items-center gap-1 text-sm tracking-wide">
                                                            {new Intl.NumberFormat("en-PH", {
                                                                style: "currency",
                                                                currency: "PHP",
                                                                minimumFractionDigits: 0,
                                                                maximumFractionDigits: 0,
                                                            }).format(Number(featuredProducts[current].value))}
                                                            <span className="uppercase text-xs font-bold opacity-90">OFF</span>
                                                        </Label>

                                                        {/* small circle */}
                                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-inner"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>



                                </div>
                                <div className="w-full flex justify-between p-3 text-4xl absolute top-[50%] transform -translate-y-1/2 mix-blend-normal">
                                    <button onClick={prevSlide}><LuCircleChevronLeft /></button>
                                    <button onClick={nextSlide}><LuCircleChevronRight /></button>
                                </div>
                            </motion.div>

                        ) : (
                            <div className="relative overflow-hidden w-full lg:w-[50%]">
                                {/* Skeleton slide */}
                                <div className="w-full min-w-full h-[400px] flex items-center justify-center">
                                    <Skeleton className="w-full h-full rounded-lg bg-black/20" />
                                </div>

                                {/* Skeleton nav arrows */}
                                <div className="w-full flex justify-between p-3 text-4xl absolute top-1/2 transform -translate-y-1/2 text-white opacity-30">
                                    <Skeleton className="h-10 w-10 rounded-full bg-black/25" />
                                    <Skeleton className="h-10 w-10 rounded-full bg-black/25" />
                                </div>
                            </div>
                        )

                        }
                    </AnimatePresence>

                </div>
            </div>
        </div >
    )
}

export default Dashboard
