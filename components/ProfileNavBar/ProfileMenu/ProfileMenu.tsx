"use client"
import React from 'react'
import { PiUserCircleThin } from "react-icons/pi";
import Image from 'next/image';
import { signOut } from "next-auth/react"
import Link from 'next/link';
import { RiArrowDropDownFill } from "react-icons/ri";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const ProfileMenu = ({ email, profile_Image }: { email: string, profile_Image: string }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='flex gap-1 items-center p-1 rounded hover:bg-[#F1F0EE]'><PiUserCircleThin className='text-[25px]' /><RiArrowDropDownFill /></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel className='flex gap-2 items-center'><Image src={profile_Image} alt="" className='w-[30px] rounded-[50%]' width={50} height={50} /> {email}</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <Link href={'/profile'}>
                        <DropdownMenuItem>
                            Profile
                        </DropdownMenuItem>
                    </Link>
                    <Link href={'/profile/settings'}>
                        <DropdownMenuItem>
                            Settings
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer' onClick={() => signOut()}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ProfileMenu
