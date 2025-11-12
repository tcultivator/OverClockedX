import React from 'react'

import Link from 'next/link';
import DropDownMenu from './DropDownMenu';
import ProfileButtonAction from './ProfileButtonAction';
import CartButtonAction from './CartButtonAction';
import { auth } from '@/auth';
const NavBar = async () => {
    const session = await auth()
    return (
        < div className="sticky z-40 bg-[#161616]  p-[2px] p-[3px] md:px-2 md:py-2  w-full top-0">
            <div className="flex justify-between bg-black inset-shadow-sm inset-shadow-white/50 rounded-[10px] items-center p-3 gap-5 lg:justify-around ">
                <Link href="/"><label className="text-[15px] font-bold  items-center text-center flex cursor-pointer text-white font-orbitron md:text-[23px]">OverClockedX</label></Link>
                <div id='menus' className='flex flex-row-reverse items-center justify-between gap-20 lg:flex-row'>
                    <DropDownMenu
                    />
                    <div className=" gap-5 items-center justify-center flex ">
                        <CartButtonAction session={session} />
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
