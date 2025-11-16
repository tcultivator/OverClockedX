'use client';
import { useState, useEffect, useRef } from 'react';
import { Label } from '../ui/label';
import { LiaTimesSolid } from "react-icons/lia";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { RiRobot2Fill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { PulseLoader } from 'react-spinners';
import { useChatBotStore } from '@/stores/chatBotStore';

type Props = {
    setOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Chat({ setOpenChat }: Props) {
    const [input, setInput] = useState('');
    //transfer this to zustand store
    const messages = useChatBotStore((state) => state.messages)
    const addUserMessage = useChatBotStore((state) => state.addUserMessage)
    const addBotMessage = useChatBotStore((state) => state.addBotMessage)
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);


    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = input.trim();
        addUserMessage(userMessage);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ message: userMessage }),
            });
            const data = await res.json();
            addBotMessage(data.reply)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white text-black w-[320px] h-[450px] rounded-xl shadow-xl flex flex-col overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-center p-3 border-b border-gray-300 bg-gray-100">
                <Label className="font-semibold text-lg">AI ChatBot</Label>
                <Button
                    onClick={() => setOpenChat(false)}
                    variant="ghost"
                    className="hover:bg-gray-200"
                >
                    <LiaTimesSolid className="text-xl" />
                </Button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-4 bg-gray-50">
                {messages.map((msg, i) => (
                    <div key={i} className="flex flex-col gap-2">

                        {/* USER MESSAGE */}
                        <div className="flex justify-end">
                            <div className="flex items-start gap-2 max-w-[75%]">
                                <div className="bg-blue-500 text-white px-3 py-2 rounded-xl shadow-sm">
                                    {msg.user}
                                </div>
                                <Label>
                                    <FaUserAlt className="text-white bg-blue-700 p-1 rounded-full text-[18px]" />
                                </Label>

                            </div>
                        </div>

                        {/* BOT MESSAGE */}
                        <div className="flex justify-start">
                            <div className="flex items-start gap-2 max-w-[75%]">
                                <Label>
                                    <RiRobot2Fill className="text-white bg-green-600 p-1 rounded-full text-[18px]" />
                                </Label>
                                <div className="bg-gray-200 text-black px-3 py-2 rounded-xl shadow-sm min-h-[30px] flex items-center">
                                    {msg.bot ?? (i === messages.length - 1 && loading ? <><PulseLoader
                                        margin={1}
                                        size={5}
                                        speedMultiplier={1}
                                    /></> : null)}
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* INPUT BAR */}
            <div className="p-3 border-t border-gray-300 bg-white flex gap-2">
                <Input
                    className="flex-1 border-gray-300 rounded-lg px-3 py-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                />
                <Button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                >
                    Send
                </Button>
            </div>

        </div>
    );
}
