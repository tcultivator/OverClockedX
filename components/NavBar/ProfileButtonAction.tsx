"use client";
import React from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';


type Props = {
    session: object | null
}
const ProfileButtonAction = ({ session }: Props) => {
    const navigate = useRouter()
    function viewProfile() {
        console.log('display the user info')
        if (!session) {
            navigate.push('/login')
        } else {
            navigate.push('/profile')
        }
    }

    return (
        <div className="cursor-pointer">
            <FaRegUserCircle onClick={() => viewProfile()} className="text-lg text-white" />
        </div>
    )
}

export default ProfileButtonAction
