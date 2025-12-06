"use client";
import React from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { useCartStore } from '@/stores/cartStore';
import { useEffect } from 'react';
import { PiUser } from "react-icons/pi";

type Props = {
    session: session | null
}

type session = {
    user?: {
        email?: string | null;
        image?: string | null;
        name?: string | null;
    }
}

const ProfileButtonAction = ({ session }: Props) => {
    const navigate = useRouter()
    const setUser = useUserStore((state) => state.setUser)
    const clearUserCartInSignout = useCartStore((state) => state.clearUserCartInSignout)
    const clearUser = useUserStore((state) => state.clearUser)
    function viewProfile() {
        
        if (!session) {
            navigate.push('/login')
        } else {
            navigate.push('/profile')
        }
    }

    useEffect(() => {
        if (
            session?.user?.email &&
            session.user.name
        ) {
            
            setUser({
                email: session.user.email,
                name: session.user.name,
                image: session.user.image ?? null
            })
        } else {
            
            clearUserCartInSignout()
            clearUser()
        }
    }, [session, setUser, clearUserCartInSignout])


    return (
        <div className="cursor-pointer">
            <PiUser onClick={() => viewProfile()} className="text-[22px] text-black" />
        </div>
    )
}

export default ProfileButtonAction
