import React from 'react'
import { CiSearch } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import Link from 'next/link';
import DropDownMenu from './DropDownMenu';
import ProfileButtonAction from './ProfileButtonAction';
import { auth } from '@/auth';
const NavBar = async () => {
    const session = await auth()
    return (
        < div className="fixed z-10 bg-black/80  w-full top-0">
            <div className="flex justify-center p-5 gap-5">
                <Link href="/"><label className="text-4xl font-Orbitron font-bold  items-center text-center flex cursor-pointer text-white" >OverClockedX</label></Link>
                <div className="w-[40%] flex items-center border  justify-between gap-4 border-gray-400">
                    <select id="" className="px-5 py-2 outline-none cursor-pointer flex items-center overflow-auto text-white">
                        <option value="All">All Categories</option>
                        <option value="Desktop">Desktop</option>
                        <option value="Laptop">Laptop</option>
                        <option value="PcComponents">PcComponents</option>
                        <option value="Peripherals">Peripherals</option>
                        <option value="Storage">Storage</option>
                        <option value="WebCam">WebCam</option>
                    </select>
                    <input className="w-full outline-none px-4 border-l text-white" type="text" placeholder='Search' />
                    <button className=" p-2 text-xl text-white"><CiSearch /></button>

                </div>
                <div className="flex gap-5 items-center justify-center ">
                    <div className="relative cursor-pointer ">
                        <CiShoppingCart className="text-4xl text-white" />
                        <label className="flex absolute bg-white text-black  w-[20px] h-[20px] text-[13px] justify-center items-center rounded top-[-7px] right-[-7px]" htmlFor="">0</label>
                    </div>
                    <ProfileButtonAction
                        session={session}
                    />
                </div>

            </div>
            <DropDownMenu />

        </div >
    )
}

export default NavBar
