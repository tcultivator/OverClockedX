"use client";
import React from 'react'
import { useCartStore } from '@/stores/cartStore';
import { LiaTimesSolid } from "react-icons/lia";
import { RiDeleteBack2Fill } from "react-icons/ri";

import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

    const clearSelectedItemsInCart = useCartStore((state) => state.clearSelectedItemsInCart)
    const clearCart = useCartStore((state) => state.clearCart)
    console.log(cartItems)
    return (
        <div id='cartMenu' className={`${openCart ? '  bg-[#1a1a1a]  w-screen h-screen top-0 right-0 fixed z-50 text-white box-border md:w-[500px] shadow-[inset_3px_0_3px_rgba(255,255,255,0.4)] rounded-xl lg:w-[500px] shadow-[inset_3px_0_3px_rgba(255,255,255,0.4)] rounded-xl xl:w-[500px] shadow-[inset_3px_0_3px_rgba(255,255,255,0.4)] rounded-xl 2xl:w-[500px] shadow-[inset_3px_0_3px_rgba(255,255,255,0.4)] rounded-xl' : 'hidden'}`} >
            <div className='relative w-full h-full box-border flex flex-col gap-2'>
                <div className='fixed relative w-full border-b border-white/50  p-3 flex justify-between items-center'>
                    <label htmlFor="">Shopping Cart</label>
                    <button onClick={openCartToggle}><LiaTimesSolid /></button>
                </div>
                {cartItems.length > 0 && <div className='px-4 underline text-blue-400 flex justify-end items-end'>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className='underline'>Clear Cart</button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete all products in the cart.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={clearCart}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>}
                <div className='overflow-y-auto max-h-[84vh] flex flex-col gap-2 rounded-[10px] px-4'>
                    {
                        cartItems.map((src, index) => (
                            <div key={index} className='flex gap-1 items-center justify-center bg-black rounded p-3 relative'>
                                <input disabled={src.stocks <= 0} type="checkbox" className='cursor-pointer' checked={checkoutItems.some(item => item.id == src.id)} onChange={(e) => {
                                    if (e.target.checked) {
                                        addToCheckout(src)
                                    } else {
                                        removeItemFromCheckoutItems(src)
                                    }
                                    // console.log(e.target.checked)
                                    // e.target.checked ? addToCheckout(src) : removeItemFromCheckoutItems(src)
                                    // // addToCheckout(src)
                                }} />
                                <div className='w-[25%]'>
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

                                </div>
                                <div className="flex gap-2 bg-black w-max p-1 px-2 rounded text-[10px]">

                                    <input disabled type="number" className=" text-white px-1 w-[20px] bg-white/30 text-center outline-none rounded p-1" value={src.quantity} />

                                </div>
                                <button onClick={() => removeItemInCart(src)} className='absolute top-0 right-0 text-[25px] text-red-400'><RiDeleteBack2Fill /></button>
                            </div>
                        ))
                    }
                </div>
                <div className='fixed bottom-0 border-t w-screen border-white/50 p-3 flex justify-between items-center md:w-[500px] lg:w-[500px] xl:w-[500px] 2xl:2-[500px]'>
                    <div className='w-full flex gap-2'>
                        <button className={`${checkoutItems.length > 0 ? 'underline text-blue-400' : 'hidden'}`} onClick={() => {
                            clearSelectedItemsInCart()
                        }}>
                            clear
                        </button>
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
        </div >
    )
}

export default CartSideBar
