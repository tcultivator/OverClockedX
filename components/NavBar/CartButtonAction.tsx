"use client";
import React from 'react'
import { CiShoppingCart } from "react-icons/ci";
import { useCartStore } from '@/stores/cartStore';
const CartButtonAction = () => {
    const cartCount = useCartStore((state) => state.cartCount)
    return (
        <div className="relative cursor-pointer ">
            <CiShoppingCart className="text-2xl text-white" />
            <label className="flex absolute bg-white text-black  w-[17px] h-[17px] text-[10px] justify-center items-center rounded top-[-7px] right-[-10px]" htmlFor="">{cartCount}</label>
        </div>
    )
}

export default CartButtonAction
