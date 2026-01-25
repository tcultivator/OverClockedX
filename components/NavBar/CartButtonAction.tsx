"use client";
import React from 'react'

import { useCartStore } from '@/stores/cartStore';


import { useEffect } from 'react';
import CartSideBar from '../CartSideBar/CartSideBar';
type session = {
    user?: {
        email?: string | null;
        image?: string | null;
        name?: string | null;
    }
}
type Props = {
    session: session | null
}
const CartButtonAction = ({ session }: Props) => {
    const fetchCartItems = useCartStore((state) => state.fetchCartItems)
    const cartItems = useCartStore((state) => state.cartItems)
    const clearUserCartInSignout = useCartStore((state) => state.clearUserCartInSignout)

    const openCartToggle = useCartStore((state) => state.openCartToggle)


    useEffect(() => {
        if (session) {
            
            const email = session.user?.email;
            fetchCartItems(email)
        } else {
            
            clearUserCartInSignout()
        }
    }, [session, clearUserCartInSignout])

    return (
        <div className="relative cursor-pointer ">
            <CartSideBar />
            {cartItems.length > 0 && < label className="flex absolute bg-primary text-white  w-[17px] h-[17px] text-[10px] justify-center items-center rounded-[50%] top-[-7px] right-[-10px]" htmlFor="">{cartItems.length}</label>}
        </div >
    )
}

export default CartButtonAction
