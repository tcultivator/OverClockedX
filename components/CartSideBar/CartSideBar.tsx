"use client";
import React from 'react'
import { useCartStore } from '@/stores/cartStore';
import { LiaTimesSolid } from "react-icons/lia";
import Image from 'next/image';
import { Button } from '../ui/button';
import { FaAngleRight } from "react-icons/fa";
import { useRouter } from 'next/navigation';
const CartSideBar = () => {
    const router = useRouter();
    const openCart = useCartStore((state) => state.openCart)
    const openCartToggle = useCartStore((state) => state.openCartToggle)
    const cartItems = useCartStore((state) => state.cartItems)
    return (
        <div id='cartMenu' className={`${openCart ? ' shadow-md absolute w-[500px] h-screen bg-[#1E1E1E] top-0 right-0 fixed z-50 text-white ' : 'hidden'}`}>
            <div className='relative  h-full box-border flex flex-col'>
                <div className='fixed relative w-full border-b border-white/50 bg-black p-3 flex justify-between items-center'>
                    <label htmlFor="">Shopping Cart</label>
                    <button onClick={openCartToggle}><LiaTimesSolid /></button>
                </div>
                <div className='overflow-y-auto max-h-[90vh] flex flex-col gap-1 rounded-[10px] px-2'>
                    {
                        cartItems.map((src, index) => (
                            <div key={index} className='flex gap-1 items-center justify-center'>
                                <input type="checkbox" />
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
                                        <label htmlFor=""> {new Intl.NumberFormat('en-PH', {
                                            style: 'currency',
                                            currency: 'PHP',
                                        }).format(src.price)}
                                        </label>
                                        <label htmlFor="">Stocks: {src.stocks > 0 ? <span>{src.stocks}</span> : <span className='text-red-500'>No Stocks Available</span>}</label>
                                    </div>
                                    <div className='flex gap-1 w-full'>
                                        <Button variant={'secondary'}>Remove</Button>
                                        <Button onClick={() => {
                                            openCartToggle()
                                            router.push(`/product/${src.product_id}`)
                                        }} disabled={src.stocks <= 0} variant={'secondary'}>Buy</Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='fixed relative bottom-0 w-full border-t border-white/50 bg-black p-3 flex justify-between items-center'>
                    <div className='w-full'>
                        <label htmlFor="">0 selected</label>
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                        <label htmlFor="">SubTotal:₱20,275.00</label>
                        <Button variant={'secondary'}>Checkout</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartSideBar
