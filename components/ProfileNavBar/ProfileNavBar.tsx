
import React from 'react'
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import Link from 'next/link';
import { signOut } from '@/auth';
import Image from 'next/image';
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { Accounts } from '@/types/AccountsType'
import ProfileMenu from './ProfileMenu/ProfileMenu';
const ProfileNavBar = async () => {
    const session = await auth();
    if (!session) {
        redirect('/')
    }

    const result = await db.query('SELECT id,email,username,profile_Image FROM accounts WHERE email = ?', [session.user?.email])
    const user = result[0] as Accounts[]
    return (
        <div className="flex flex-col bg-white text-black  box-border w-full p-2">
            <div className='w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] 2xl:w-[70%] mx-auto flex items-center justify-between'>
                <div className='flex items-end gap-4'>
                    <Link href="/"><label className="text-[15px] items-center text-center flex py-1 cursor-pointer text-black font-orbitron md:text-[22px]">OVERCLOCKEDX</label></Link>
                    <div className='flex items-center gap-1'>
                        <Link href="/" className=' text-[13px] hover:bg-[#F1F0EE] rounded px-2 py-[6px]  text-black flex gap-1 items-center justify-start'>Shop</Link>
                        <Link href="/profile/Purchase" className='hover:bg-[#F1F0EE] rounded px-2 py-[6px] text-[13px]  text-black flex gap-1 items-center justify-start'>Orders</Link>
                    </div>

                </div>
                <ProfileMenu email={session.user?.email || 'no email'} profile_Image={user[0].profile_Image} />

            </div>



        </div>
    )
}

export default ProfileNavBar
