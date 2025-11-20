"use client"
import React from 'react'

import { Button } from '@/components/ui/button'
import { RiCustomerService2Line } from "react-icons/ri";
import Chat from '../Chat';
import { useState } from 'react';
import { RiRobot2Line } from "react-icons/ri";
import Image from 'next/image';

const FloatingChatBot = () => {
    const [openChat, setOpenChat] = useState<boolean>(false)
    return (
        <div className='fixed bottom-5 right-5 flex flex-col justify-end items-end gap-3 z-50'>
            {
                openChat && <Chat setOpenChat={setOpenChat} />
            }
            <Image
                src={'/robot.gif'}
                alt=''
                width={200}
                height={200}
                className='rounded-[50%] w-[50px] h-[50px] inset-shadow-sm inset-shadow-black/50 cursor-pointer'
                onClick={() => setOpenChat(prev => !prev)} />
            {/* <Button variant={'secondary'} className='w-[50px] h-[50px] bg-white rounded-[50%] p-0' onClick={() => setOpenChat(prev => !prev)}><RiRobot2Line  /></Button> */}
        </div>
    )
}

export default FloatingChatBot
