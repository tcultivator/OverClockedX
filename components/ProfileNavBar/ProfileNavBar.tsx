
import React from 'react'
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import Link from 'next/link';
import { signOut } from '@/auth';
import Image from 'next/image';

const ProfileNavBar = async () => {
    return (
        <div className="flex flex-col bg-black/100 rounded-t-xl inset-shadow-sm inset-shadow-white/50 lg:inset-shadow-none lg:shadow-none box-border w-full lg:w-[200px] lg:bg-black/0">
            <div className='flex gap-3 p-10 lg:p-2'>
                <Image src="/globe.svg" alt="" className='w-[50px]' width={50} height={50} />
                <div className='flex flex-col gap-0 justify-start text-start'>
                    <label htmlFor="">Username</label>
                    <Link href="/profile" className='p-0 m-0 text-[13px]  text-white/80 flex gap-1 items-center justify-start'><FaRegPenToSquare />Edit profile</Link>
                </div>

            </div>
            <div className=' flex flex-row items-center justify-around py-2 border-t border-b border-white/80 text-[13px] lg:flex-col lg:gap-2 lg:ml-11 lg:border-0'>
                <div className='w-[50%] lg:w-full'>
                    <div className='hidden lg:flex flex-row lg:items-center lg:gap-2 lg:text-[17px]'>
                        <FaRegUserCircle />
                        <label htmlFor="">My Account</label>
                    </div>
                    <div className='w-full flex flex-row justify-around lg:flex-col'>
                        <Link href={"/profile"} className='border-r border-white/80 w-full text-center lg:border-0 lg:text-start lg:ml-11'>Profile</Link>
                        <Link href={"/profile/Address"} className='border-r border-white/80 w-full text-center lg:border-0 lg:text-start lg:ml-11'>Address</Link>
                    </div>
                </div>
                <div className='w-[25%] flex justify-center border-r border-white/80 lg:border-0 lg:text-[17px] lg:w-full lg:justify-start'>
                    <div className=''>
                        <Link href={"/profile/Purchase"} className=''>My Purchase</Link>
                    </div>
                </div>
                <form className='w-[25%] flex justify-center lg:text-[17px] lg:w-full lg:justify-start'
                    action={async () => {
                        "use server"
                        await signOut()
                    }}
                >
                    <button type="submit" className="">Signout</button>
                </form>
            </div>


        </div>
    )
}

export default ProfileNavBar
