"use client";
import React from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { useCartStore } from '@/stores/cartStore';
import { useEffect } from 'react';
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
    function viewProfile() {
        console.log('display the user info')
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
            console.log('dapat gagana to')
            setUser({
                email: session.user.email,
                name: session.user.name,
                image: session.user.image ?? null
            })
        } else {
            console.log('dapat eto naman gagana kapag naglogout')
            clearUserCartInSignout()
        }
    }, [session, setUser,clearUserCartInSignout])


    return (
        <div className="cursor-pointer">
            <FaRegUserCircle onClick={() => viewProfile()} className="text-lg text-white" />
        </div>
    )
}

export default ProfileButtonAction
