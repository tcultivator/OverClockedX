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
            console.log('eto ung laman ng session ', session.user?.email)
            const email = session.user?.email;
            fetchCartItems(email)
        } else {
            console.log('try kung gagana to kapag nabago laman ng session')
            clearUserCartInSignout()
        }
    }, [session, clearUserCartInSignout])

    return (
        <div className="relative cursor-pointer ">
            <CartSideBar />
            <label className="flex absolute bg-white text-black  w-[17px] h-[17px] text-[10px] justify-center items-center rounded top-[-7px] right-[-10px]" htmlFor="">{cartItems.length}</label>
        </div>
    )
}

export default CartButtonAction
