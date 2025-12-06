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
import { Label } from '../ui/label';


const FeaturedProducts = () => {
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
            setFeaturedProducts(response)

        }
        getFeaturedProductsFunc()

    }, [])

    return (
        <div className="flex w-full bg-white  p-5">
            {
                featuredProducts.length > 0 ?
                    <div className='flex  justify-between w-[80%] mx-auto'>
                        {
                            featuredProducts.map((data, index) => (
                                <div key={index} className='flex flex-col items-center justify-center w-[140px]'>

                                    <Image
                                        src={data.product_image}
                                        alt=''
                                        width={1000}
                                        height={1000}
                                        className='w-full max-w-full flex-shrink-0 object-contain aspect-square ' />
                                    <Label className='line-clamp-2 text-center items-center font-light mt-[-10px]'>{data.product_name}</Label>
                                </div>
                            ))
                        }

                    </div> :
                    <div className='flex  justify-between w-[80%] mx-auto'>
                        {
                            featuredProducts.map((data, index) => (
                                <div key={index} className='flex flex-col gap-1 items-center justify-center w-[140px]'>

                                    <Skeleton className=' bg-black/20 text-[15px]  w-full max-w-full flex-shrink-0 object-contain aspect-square' />
                                    
                                </div>
                            ))
                        }

                    </div>

            }


        </div >
    )
}

export default FeaturedProducts
