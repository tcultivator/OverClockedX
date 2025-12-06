import React from 'react'

import Link from 'next/link';
import DropDownMenu from './DropDownMenu';
import ProfileButtonAction from './ProfileButtonAction';
import CartButtonAction from './CartButtonAction';
import { auth } from '@/auth';
import SearchActions from './SearchActions';
const NavBar = async () => {
    const session = await auth()

    return (
        < div className="sticky z-50 bg-white flex flex-col justify-center items-center py-2  md:px-2 md:py-2  w-full top-0">
            <div className="flex justify-between  items-center p-1 gap-5 w-full px-5">
                <SearchActions />

                <div className='w-[50%] flex justify-center items-center'>
                    <Link href="/"><label className="text-[18px] items-center text-center flex cursor-pointer text-black font-orbitron md:text-[27px]">OVERCLOCKEDX</label></Link>
                </div>

                <div id='menus' className='flex  w-[25%] items-end justify-end gap-20 '>
                    <div className=" gap-5 items-start justify-start flex ">
                        <CartButtonAction session={session} />
                        <ProfileButtonAction
                            session={session}
                        />
                    </div>
                </div>
            </div>
            <DropDownMenu
            />
        </div >
    )
}

export default NavBar
