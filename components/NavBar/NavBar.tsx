import React from 'react'
import { CiShoppingCart } from "react-icons/ci";
import Link from 'next/link';
import DropDownMenu from './DropDownMenu';
import ProfileButtonAction from './ProfileButtonAction';
import { auth } from '@/auth';
const NavBar = async () => {
    const session = await auth()
    return (
        < div className="sticky z-20 bg-[#1E1E1E]  p-2  w-full top-0">
            <div className="flex justify-between bg-black rounded-[10px] items-center p-3 gap-5 lg:justify-around ">
                <Link href="/"><label className="text-[15px] font-bold  items-center text-center flex cursor-pointer text-white font-orbitron md:text-[23px]">OverClockedX</label></Link>
                <div id='menus' className='flex flex-row-reverse items-center justify-between gap-20 lg:flex-row'>
                    <DropDownMenu
                    />
                    <div className=" gap-5 items-center justify-center flex ">
                        <div className="relative cursor-pointer ">
                            <CiShoppingCart className="text-2xl text-white" />
                            <label className="flex absolute bg-white text-black  w-[17px] h-[17px] text-[10px] justify-center items-center rounded top-[-7px] right-[-10px]" htmlFor="">0</label>
                        </div>
                        <ProfileButtonAction
                            session={session}
                        />
                    </div>
                </div>
               


            </div>
        </div >
    )
}

export default NavBar
