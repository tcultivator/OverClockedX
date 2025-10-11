"use client"
import React from 'react'
import Image from 'next/image';
import { Button } from '../ui/button';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuCircleChevronLeft } from "react-icons/lu";
import { LuCircleChevronRight } from "react-icons/lu";
import { useCartStore } from '@/stores/cartStore';
import { useUserStore } from '@/stores/userStore';
import { TfiShoppingCart } from "react-icons/tfi";
import { MdShoppingCartCheckout } from "react-icons/md";
import { Props } from '@/types/CheckoutPageProps'


const CheckoutProduct = ({ id, product_id, product_image,
    description,
    brand,
    product_name,
    price,
    stocks }: Props) => {
    const router = useRouter();
    const addToSeperateItem = useCartStore((state) => state.addToSeperateItem)
    const user = useUserStore((state) => state.user)
    const [quantity, setQuantity] = useState(1)

    return (
        <div className='px-2'>
            <div className=" w-full flex-column gap-2 sm:flex flex-row">
                <div className="w-full text-white  h-full p-2 bg-black rounded-t-[10px] sm:w-[50%] sm:p-10 sm:inset-shadow-sm inset-shadow-white/50 sm:rounded-[10px]">
                    <div className=' rounded-[10px] relative'>
                        <Image
                            src={product_image}
                            width={500}
                            height={500}
                            alt=''
                            className="w-full m-auto sm:w-[90%]"
                        />
                        <div className="w-full flex p-3 justify-between text-4xl absolute top-[50%] transform -translate-y-1/2 text-white">
                            <button><LuCircleChevronLeft /></button>
                            <button ><LuCircleChevronRight /></button>
                        </div>
                    </div>
                </div>
                <div className="w-full text-white  flex flex-col gap-3 p-2 bg-black rounded-b-[10px] sm:w-[50%] sm:p-10 sm:inset-shadow-sm inset-shadow-white/50 sm:rounded-[10px] ">
                    <label htmlFor="">{brand}</label>
                    <label className="text-[20px] font-anton md:text-[20px] lg:text-[30px] xl:text-[40px] 2xl:text-[50px]">{product_name}</label>
                    <label className="text-[25px] font-anton md:text-[15px] lg:text-[35px] xl:text-[45px] 2xl:text-[55px]">₱{price}</label>
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
                        <Button className='p-5 flex items-center justify-center gap-3' onClick={() => console.log('eto ung selected payment options, ')} ><TfiShoppingCart />Add to Cart</Button>
                        <Button className='p-5 flex items-center justify-center gap-3' onClick={() => {
                            addToSeperateItem({
                                id: id,
                                email: user?.email,
                                product_id: product_id,
                                product_name: product_name,
                                product_image: product_image,
                                price: price,
                                stocks: stocks,
                                quantity: quantity
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
