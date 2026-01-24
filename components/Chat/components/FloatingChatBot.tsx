"use client"
import React from 'react';
import Chat from '../Chat';
import { useState } from 'react';
import { RiRobot2Line } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";

const FloatingChatBot = () => {
    const [openChat, setOpenChat] = useState<boolean>(false)
    return (
        <div className='fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2'>
            {
                openChat && <Chat setOpenChat={setOpenChat} />
            }

           
            <div
                onClick={() => setOpenChat(prev => !prev)}
                className={`
                    group relative flex items-center justify-center cursor-pointer 
                    w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ease-in-out
                    border border-white/10 backdrop-blur-sm
                    ${openChat
                        ? 'bg-zinc-800 rotate-0 hover:bg-zinc-700'
                        : 'bg-zinc-900 hover:scale-110 hover:bg-zinc-800'
                    }
                `}
            >
                
                {!openChat && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                )}

              
                <div className="text-white text-2xl transition-transform duration-300">
                    {openChat ? (
                        <LiaTimesSolid className="animate-in fade-in zoom-in duration-200" />
                    ) : (
                        <RiRobot2Line className="animate-in fade-in zoom-in duration-200" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default FloatingChatBot