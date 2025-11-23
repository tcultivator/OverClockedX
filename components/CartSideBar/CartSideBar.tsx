"use client";
import React from 'react'
import { useCartStore } from '@/stores/cartStore';
import { LiaTimesSolid } from "react-icons/lia";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { CiShoppingCart } from "react-icons/ci";
import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

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
        <Sheet open={openCart}>
            <SheetTrigger asChild>
                <CiShoppingCart onClick={() => openCartToggle()} className="text-2xl text-white" />
            </SheetTrigger>
            <SheetContent>
                <div className='border-b border-white/30 flex items-center p-3 justify-between'>
                    <SheetTitle>Shopping Cart</SheetTitle>
                    <LiaTimesSolid onClick={() => openCartToggle()} className="text-md cursor-pointer text-white" />
                </div>

                <div className='relative w-full h-full box-border flex flex-col gap-2'>
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
                    <div className='overflow-y-auto max-h-[84vh] flex flex-col gap-2 px-1'>
                        {
                            cartItems.map((src, index) => (
                                <div key={index} className='flex gap-1 items-center justify-center bg-black border-b border-white/15 p-1 relative'>
                                    <input disabled={src.stocks <= 0} type="checkbox" className='cursor-pointer' checked={checkoutItems.some(item => item.id == src.id)} onChange={(e) => {
                                        if (e.target.checked) {
                                            addToCheckout(src)
                                        } else {
                                            removeItemFromCheckoutItems(src)
                                        }
                                    }} />
                                    <div onClick={() => {
                                        openCartToggle()
                                        router.push(`/product/${src.product_id}`)
                                    }} className='w-[25%]'>
                                        <Image
                                            src={src.product_image}
                                            alt=''
                                            width={500}
                                            height={500} />
                                    </div>
                                    <div onClick={() => {
                                        openCartToggle()
                                        router.push(`/product/${src.product_id}`)
                                    }} className='w-[60%] flex flex-col gap-1'>
                                        <div className='flex flex-col'>
                                            <Label htmlFor="">{src.product_name}</Label>
                                            <div className='flex gap-1 items-center'>
                                                <Label className={`${src.value != null && 'text-white/50 line-through text-[11px]'}`} htmlFor=""> {new Intl.NumberFormat('en-PH', {
                                                    style: 'currency',
                                                    currency: 'PHP',
                                                }).format(src.price)}
                                                </Label>
                                                {src.value != null && <Label htmlFor=""> {new Intl.NumberFormat('en-PH', {
                                                    style: 'currency',
                                                    currency: 'PHP',
                                                }).format(src.price - src.value)}
                                                </Label>}
                                            </div>

                                            <Label htmlFor="">Stocks: {src.stocks > 0 ? <span>{src.stocks}</span> : <span className='text-red-500'>Out of stocks</span>}</Label>
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
                </div>
                <SheetFooter>
                    <div className='flex items-center gap-2'>
                        <div className='w-[49%] flex gap-2'>
                            <button className={`${checkoutItems.length > 0 ? 'underline text-blue-400 cursor-pointer' : 'hidden'}`} onClick={() => {
                                clearSelectedItemsInCart()
                            }}>
                                <Label>Clear</Label>
                            </button>
                            <Label htmlFor=""><span>{checkoutItems.length}</span> selected</Label>
                        </div>
                        <Label className='w-[49%] text-end flex justify-end' htmlFor="">SubTotal: <span>{checkoutItems.length > 0 ? new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(checkoutItems.reduce((sum, item) => sum + item.price * 1, 0)) : new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(0)}</span></Label>
                    </div>
                    <div className='flex items-center gap-2'>

                        <Button onClick={() => openCartToggle()} variant={'secondary'} className='w-[49%]'>Close</Button>


                        <Button disabled={checkoutItems.length <= 0} onClick={() => {
                            addToFinalCheckout()
                            openCartToggle()
                            router.push('/checkout')
                        }} variant={'secondary'} className='w-[49%]'>Checkout</Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default CartSideBar
