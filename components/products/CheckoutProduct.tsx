"use client"
import React from 'react'
import Image from 'next/image';
import { Button } from '../ui/button';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useUserStore } from '@/stores/userStore';
import { TfiShoppingCart } from "react-icons/tfi";
import { MdShoppingCartCheckout } from "react-icons/md";
import { Props } from '@/types/CheckoutPageProps'
import { useToast } from '@/stores/toastStore';
import { FaArrowLeft } from "react-icons/fa6";
import { Label } from '../ui/label';
const CheckoutProduct = ({ id, product_id, product_image,
    description,
    brand,
    product_name,
    price,
    stocks,
    value }: Props) => {
    const router = useRouter();
    const addToSeperateItem = useCartStore((state) => state.addToSeperateItem)
    const addToCart = useCartStore((state) => state.addToCart)
    const user = useUserStore((state) => state.user)
    const [quantity, setQuantity] = useState(1)
    const toastState = useToast((state) => state.toastState)
    console.log('eto laman ng value', value)
    return (
        <div className='px-[2px] md:px-2'>
            <div className=" w-full flex-column gap-2 sm:flex flex-row">
                <div className="w-full text-white  h-full p-2 bg-black rounded-t-[10px] sm:w-[50%] sm:p-10 sm:inset-shadow-sm inset-shadow-white/50 sm:rounded-[10px]">
                    <Button onClick={() => window.history.back()}><FaArrowLeft /></Button>
                    <div className=' rounded-[10px] relative'>
                        <Image
                            src={product_image}
                            width={500}
                            height={500}
                            alt=''
                            className="w-full m-auto sm:w-[90%]"
                        />
                        {value != null && <Label className=' absolute top-1 right-1 rounded text-[20px] font-anton md:text-[10px] lg:text-[30px] xl:text-[40px] 2xl:text-[50px] p-1 bg-red-400 flex items-center gap-1'>{new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(Number(value))}<span>OFF</span></Label>}

                    </div>
                </div>
                <div className="w-full text-white  flex flex-col gap-3 p-2 bg-black rounded-b-[10px] sm:w-[50%] sm:p-10 sm:inset-shadow-sm inset-shadow-white/50 sm:rounded-[10px] ">
                    <label htmlFor="">{brand}</label>
                    <label className="text-[20px] font-anton md:text-[20px] lg:text-[30px] xl:text-[40px] 2xl:text-[50px]">{product_name}</label>
                    <div className='flex gap-2 items-center'>
                        <label className={` ${value != null ? 'line-through text-white/30 text-[15px] md:text-[8px] lg:text-[25px] xl:text-[35px] 2xl:text-[40px]' : ' text-white text-[25px]  font-anton md:text-[15px] lg:text-[35px] xl:text-[45px] 2xl:text-[55px]'}`}>₱{price}</label>
                        {value != null && <label className='text-white text-[25px]  font-anton md:text-[15px] lg:text-[35px] xl:text-[45px] 2xl:text-[55px]'>{new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(price - Number(value))}</label>}
                    </div>
                    <label className="text-lg">Stocks: <span>{stocks}</span></label>

                    <div className="flex gap-5">
                        <div className="flex gap-2 bg-black border border-gray-500 w-max p-2 px-4 rounded-[10px]">
                            <button className="text-white" onClick={() => {
                                if (quantity > 1) {
                                    setQuantity(prev => prev - 1)
                                }
                            }}><FaMinus /></button>
                            <input disabled type="number" className=" text-white px-1 w-[50px] text-center outline-none" placeholder="0" value={quantity} />
                            <button className="text-white" onClick={() => {
                                if (stocks > quantity) {
                                    setQuantity(prev => prev + 1)
                                }

                            }}><FaPlus /></button>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-2'>
                        <Button disabled={toastState} className='p-5 flex items-center justify-center gap-3' onClick={() => {
                            addToCart({
                                id: id,
                                email: user?.email,
                                product_id: product_id,
                                product_name: product_name,
                                product_image: product_image,
                                price: price,
                                stocks: stocks,
                                quantity: 1,
                                value:value
                            })
                        }} ><TfiShoppingCart />Add to Cart</Button>
                        <Button className='p-5 flex items-center justify-center gap-3' onClick={() => {
                            addToSeperateItem({
                                id: id,
                                email: user?.email,
                                product_id: product_id,
                                product_name: product_name,
                                product_image: product_image,
                                price: price,
                                stocks: stocks,
                                quantity: quantity,
                                value: value
                            })
                            router.push('/checkout')
                            // CheckoutProduct()
                        }} variant={'secondary'} disabled={stocks < 1}><MdShoppingCartCheckout />Checkout</Button>
                    </div>



                    <h1 className="font-bold">Description</h1>
                    <p className='font-thin md:text-[12px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]'>{description}</p>


                </div>
            </div>
        </div>
    )
}

export default CheckoutProduct
