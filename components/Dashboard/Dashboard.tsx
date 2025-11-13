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
import { Button } from '../ui/button';

//zustand
// shared state
import { useCartStore } from '@/stores/cartStore';
import { useUserStore } from '@/stores/userStore';
import { useToast } from '@/stores/toastStore';

//this is the framer motion import, this allow to have an animation
import { motion, AnimatePresence } from 'framer-motion'


const Dashboard = () => {
    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const [featuredProducts, setFeaturedProducts] = useState<ProductsType[]>([])

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
            console.log(response)
            console.log(current)
            setFeaturedProducts(response)

        }
        getFeaturedProductsFunc()
        
    }, [])


    function prevSlide() {

        setCurrent((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1));

    };
    function nextSlide() {
        // console.log('eto ung laman ng user kapag nakalogin, ', user)
        setCurrent((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));

    };

    // function selectSlide(index: number) {
    //     setCurrent(index)
    // }
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    });

     function SelectCategories(category: string): void {
        router.push(`/categories/${category}`);
    }
    return (
        <div className="flex flex-col gap-5">
            <div className='flex flex-col px-[2px] gap-[2px] sm:px-2 sm:gap-2 md:flex-row lg:flex-row '>
                <div className='text-white w-full flex flex-col rounded-t-xl bg-black inset-shadow-sm inset-shadow-white/50 justify-center items-start px-[3%] py-[5%] rounded-[10px] w-[40%] md:w-[30%] 2xl:w-[35%]'>
                    <div className='flex flex-col text-[70px] font-anton md:text-[30px] lg:text-[50px] xl:text-[70px] 2xl:text-[90px]'>
                        <p >Gear Up</p>
                        <p >Plug In</p>
                        <p >Power On</p>
                    </div>
                    <label htmlFor="" id='typewriter' className='font-normal md:text-[12px] max-w-max lg:text-[15px] xl:text-[16px] 2xl:text-[18px]'>OverClockedX - Upgrade yours now!</label>
                    <Button onClick={()=>SelectCategories('allProducts')} variant={'secondary'} className='p-5'>SHOP NOW</Button>
                </div>
                <div className='text-white w-full gap-1 flex flex-col items-center bg-black inset-shadow-sm inset-shadow-white/50 py-7 rounded-[10px] w-[60%] px-[3%] relative sm:py-3 md:w-[70%] py-3 flex-row 2xl:ww-[65%] py-3'>
                    <AnimatePresence mode='wait'>
                        {featuredProducts.length > 0 ?
                            (<motion.div className='flex flex-col w-full lg:w-[40%]'
                                key={featuredProducts[current].id}
                                initial={{ opacity: 0, y: -100, animationDuration: .5 }}
                                animate={{ opacity: 1, y: 0, animationDuration: .5 }}
                                exit={{ opacity: 0, animationDuration: .5 }}>

                                <label className='text-[15px] font-anton md:text-[20px] lg:text-[30px] xl:text-[40px] 2xl:text-[50px]'>{featuredProducts[current].product_name}</label>
                                <label className='font-thin text-[11px] md:text-[12px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]'>{featuredProducts[current].description}</label>
                                <label className='text-[15px] font-anton md:text-[15px] lg:text-[20px] xl:text-[25px] 2xl:text-[30px]'>
                                    {new Intl.NumberFormat('en-PH', {
                                        style: 'currency',
                                        currency: 'PHP',
                                    }).format(featuredProducts[current].price)}
                                </label>
                                <div className="mt-4 flex flex-col md:w-[90%] gap-1 sm:flex-row">
                                    <button onClick={() => router.push(`/product/${featuredProducts[current].product_id}`)} className='bg-white text-[10px] py-2 w-full text-black   rounded-[10px] md:text-[12px]  rounded-[5px]'>BUY</button>
                                    <button disabled={toastState} onClick={() => {
                                        addToCart({
                                            id: featuredProducts[current].id,
                                            email: user?.email,
                                            product_id: featuredProducts[current].product_id,
                                            product_name: featuredProducts[current].product_name,
                                            product_image: featuredProducts[current].product_image,
                                            price: featuredProducts[current].price,
                                            stocks: featuredProducts[current].stocks,
                                            quantity: 1
                                        })
                                    }} className='bg-white text-[10px] py-2 w-full flex flex-col items-center justify-center text-black  rounded-[10px] md:text-[12px] rounded-[5px] lg:flex-row '><AiOutlineShoppingCart className='text-[15px]' />  ADD TO CART</button>
                                </div>

                            </motion.div>) :
                            (
                                <div className='flex flex-col gap-2 w-full lg:w-[40%]'>
                                    <Skeleton className=' bg-white/10 text-[15px] h-[100px] w-full rounded-xl font-anton md:text-[20px] lg:text-[30px] xl:text-[40px] 2xl:text-[50px]' />
                                    <Skeleton className='bg-white/10 font-thin h-[70px] w-full text-[11px] md:text-[12px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]' />
                                    <Skeleton className=' bg-white/10 text-[15px] h-[50px] w-full font-anton md:text-[15px] lg:text-[20px] xl:text-[25px] 2xl:text-[30px]' />
                                    <div className="mt-4 flex flex-col gap-1 sm:flex-row">
                                        <Skeleton className='bg-white/10 h-[50px] w-full text-[10px] py-2 w-full text-black   rounded-[10px] md:text-[12px]  rounded-[5px]' />
                                        <Skeleton className='bg-white/10 h-[50px] w-full text-[10px] py-2 w-full flex flex-col items-center justify-center text-black  rounded-[10px] md:text-[12px] rounded-[5px] lg:flex-row ' />
                                    </div>

                                </div>
                            )
                        }
                    </AnimatePresence>

                    {featuredProducts.length > 0 ? (

                        <div className="relative overflow-hidden w-full lg:w-[60%]">
                            <div className="flex relative w-full transition-transform duration-700 ease-in-out " style={{ transform: `translateX(-${current * 100}%)` }}>

                                {featuredProducts.map((src, idx) => (
                                    <Image
                                        key={idx}
                                        src={src.product_image}
                                        alt=''
                                        width={1000}
                                        height={1000}
                                        className='w-full max-w-full flex-shrink-0 object-contain' />
                                ))}

                            </div>
                            <div className="w-full flex justify-between p-3 text-4xl absolute top-[50%] transform -translate-y-1/2 text-white">
                                <button onClick={prevSlide}><LuCircleChevronLeft /></button>
                                <button onClick={nextSlide}><LuCircleChevronRight /></button>
                            </div>
                        </div>

                    ) : (
                        <div className="relative overflow-hidden w-full lg:w-[60%]">
                            {/* Skeleton slide */}
                            <div className="w-full min-w-full h-[400px] flex items-center justify-center">
                                <Skeleton className="w-full h-full rounded-lg bg-white/10" />
                            </div>

                            {/* Skeleton nav arrows */}
                            <div className="w-full flex justify-between p-3 text-4xl absolute top-1/2 transform -translate-y-1/2 text-white opacity-30">
                                <Skeleton className="h-10 w-10 rounded-full bg-white/12" />
                                <Skeleton className="h-10 w-10 rounded-full bg-white/12" />
                            </div>
                        </div>
                    )

                    }


                </div>
            </div>
        </div >
    )
}

export default Dashboard
