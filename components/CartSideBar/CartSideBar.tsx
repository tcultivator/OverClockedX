"use client";
import React from 'react'
import { useCartStore } from '@/stores/cartStore';
import { LiaTimesSolid } from "react-icons/lia";
import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const CartSideBar = () => {
    const router = useRouter();
    const openCart = useCartStore((state) => state.openCart)
    const openCartToggle = useCartStore((state) => state.openCartToggle)
    const cartItems = useCartStore((state) => state.cartItems)
    const checkoutItems = useCartStore((state) => state.checkoutItems)
    const addToCheckout = useCartStore((state) => state.addToCheckout)
    const removeItemFromCheckoutItems = useCartStore((state) => state.removeItemFromCheckoutItems)
    const removeItemInCart = useCartStore((state) => state.removeItemInCart)

    const addToFinalCheckout = useCartStore((state) => state.addToFinalCheckout)
    return (
        <div id='cartMenu' className={`${openCart ? ' shadow-md absolute w-[500px] h-screen bg-[#1E1E1E] top-0 right-0 fixed z-50 text-white box-border' : 'hidden'}`} >
            <div className='relative w-full h-full box-border flex flex-col'>
                <div className='fixed relative w-full border-b border-white/50 bg-black p-3 flex justify-between items-center'>
                    <label htmlFor="">Shopping Cart</label>
                    <button onClick={openCartToggle}><LiaTimesSolid /></button>
                </div>
                <div className='overflow-y-auto max-h-[90vh] flex flex-col gap-1 rounded-[10px] px-5'>
                    {
                        cartItems.map((src, index) => (
                            <div key={index} className='flex gap-1 items-center justify-center'>
                                <input disabled={src.stocks <= 0} type="checkbox" className='cursor-pointer' onChange={(e) => {
                                    console.log(e.target.checked)
                                    e.target.checked ? addToCheckout(src) : removeItemFromCheckoutItems(src)
                                    // addToCheckout(src)
                                }} />
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
                                        <label htmlFor="">Stocks: {src.stocks > 0 ? <span>{src.stocks}</span> : <span className='text-red-500'>Out of stocks</span>}</label>
                                    </div>
                                    <div className='flex gap-1 w-full'>
                                        <Button onClick={() => removeItemInCart(src)} variant={'secondary'}>Remove</Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='fixed bottom-0 w-[500px] border-t border-white/50 bg-black p-3 flex justify-between items-center'>
                    <div className='w-full'>
                        <label htmlFor=""><span>{checkoutItems.length}</span> selected</label>
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                        <label htmlFor="">SubTotal: <span>{checkoutItems.length > 0 ? new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(checkoutItems.reduce((sum, item) => sum + item.price * 1, 0)) : new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(0)}</span></label>
                        <Button disabled={checkoutItems.length <= 0} onClick={() => {
                            addToFinalCheckout()
                            router.push('/checkout')
                            openCartToggle()
                            console.log('eto ung laman ng checkout items, ', checkoutItems)
                        }} variant={'secondary'}>Checkout</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartSideBar
