"use client";
import React from 'react'
import { useCartStore } from '@/stores/cartStore';
import { LiaTimesSolid } from "react-icons/lia";
import Image from 'next/image';
import { Button } from '../ui/button';

const CartSideBar = () => {
    const openCart = useCartStore((state) => state.openCart)
    const openCartToggle = useCartStore((state) => state.openCartToggle)
    const cartItems = useCartStore((state) => state.cartItems)
    return (
        <div className={`${openCart ? ' border-l-4 border-white/20 absolute w-[500px] h-[100vh] bg-[#1E1E1E] top-0 right-0 fixed z-50 rounded-[10px] text-white ' : 'hidden'}`}>
            <div className='bg-black overflow-y-auto max-h-[100vh]'>
                <div className='sticky p-5 '>
                    <button onClick={openCartToggle}><LiaTimesSolid /></button>
                </div>
                {
                    cartItems.map((src, index) => (
                        <div key={index} className='flex gap-1 items-center justify-center'>
                            <div className='w-[40%]'>
                                <Image
                                    src={src.product_image}
                                    alt=''
                                    width={500}
                                    height={500} />
                            </div>
                            <div className='w-[60%] flex flex-col gap-1'>
                                <div className='flex flex-col'>
                                    <label htmlFor="">{src.product_name}</label>
                                    <label htmlFor="">{src.price}</label>
                                </div>
                                <div className='flex gap-1 w-full'>
                                    <Button variant={'secondary'}>Remove</Button>
                                    <Button variant={'secondary'}>Buy</Button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>



        </div>
    )
}

export default CartSideBar
