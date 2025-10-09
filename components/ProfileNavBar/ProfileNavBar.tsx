
import React from 'react'
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import Link from 'next/link';
import { signOut } from '@/auth';
import Image from 'next/image';
const ProfileNavBar = async () => {
    return (
        <div className='flex flex-col gap-5 w-[180px]'>
            <div className='flex gap-3'>
                <Image src="/globe.svg" alt="" className='w-[50px]' width={50} height={50}/>
                <div className='flex flex-col gap-0 justify-start text-start'>
                    <label htmlFor="">Username</label>
                    <Link href="/profile" className='p-0 m-0 text-[13px] text-white/80 flex gap-1 items-center justify-start'><FaRegPenToSquare />Edit profile</Link>
                </div>

            </div>

            <div className=''>
                <div className='flex gap-2 items-center'>
                    <FaRegUserCircle />
                    <label htmlFor="">My Account</label>
                </div>
                <div className='flex flex-col gap-1 text-start ml-11 text-white/80 text-[13px]'>
                    <Link href={"/profile"} className='text-start'>Profile</Link>
                    <Link href={"/profile/Address"} className='text-start'>Address</Link>
                    <Link href={"/profile/Voucher"} className='text-start'>Vouchers</Link>
                </div>
            </div>
            <div>
                <div className='flex gap-2 items-center'>
                    <Link href={"/profile/Purchase"} className='text-start'>My Purchase</Link>
                </div>
            </div>
            <form
                action={async () => {
                    "use server"
                    await signOut()
                }}
            >
                <button type="submit" className="">Signout</button>
            </form>

        </div>
    )
}

export default ProfileNavBar
