"use client"
import React from 'react'

import { Button } from '@/components/ui/button'
import { RiCustomerService2Line } from "react-icons/ri";
import Chat from '../Chat';
import { useState } from 'react';
const FloatingChatBot = () => {
    const [openChat, setOpenChat] = useState<boolean>(false)
    return (
        <div className='fixed bottom-5 right-5 flex flex-col justify-end items-end gap-3 z-50'>
            {
                openChat && <Chat setOpenChat={setOpenChat} />
            }
            <Button variant={'secondary'} className='w-[50px] h-[50px] bg-white rounded-[50%]' onClick={() => setOpenChat(prev => !prev)}><RiCustomerService2Line /></Button>
        </div>
    )
}

export default FloatingChatBot
