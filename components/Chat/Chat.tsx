'use client';
import { useState, useEffect, useRef } from 'react';
import { Label } from '../ui/label';
import { LiaTimesSolid } from "react-icons/lia";
import { Button } from '../ui/button';
import { RiRobot2Fill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { PulseLoader } from 'react-spinners';
import { useChatBotStore } from '@/stores/chatBotStore';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown';
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
        <AnimatePresence mode='wait'>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: .1 }}
                className="bg-white text-black border border-black/10 w-[320px] h-[500px] lg:w-[330px] lg:h-[470px] xl:w-[350px] xl:h-[500px] 2xl:w-[400px] 2xl:h-[550px] rounded shadow-xl flex flex-col overflow-hidden z-50">

                {/* HEADER */}
                <div className="flex justify-between items-center p-3 border-b border-gray-300 bg-gray-100">
                    <Label className="font-semibold text-sm">Techmate - AI assistant</Label>
                    <Button
                        onClick={() => setOpenChat(false)}
                        variant="ghost"
                        className="hover:bg-gray-200"
                    >
                        <LiaTimesSolid className="text-xl" />
                    </Button>
                </div>
                {messages.length === 0 && (
                    <div className="w-full flex flex-col items-center justify-center my-auto px-6 text-center relative">
                       
                        
                        <h2 className="text-[12px] font-semibold text-black mb-2">
                            How can I help you today?
                        </h2>

                        <p className="text-[11px] text-black/60 max-w-md mb-3">
                            Ask me about our products, get recommendations, or learn more about our services.
                        </p>

                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 w-full max-w-md">
                            {[
                                "Recommend a products",
                                "Tell me about best selling products",
                                "What are the latest laptops?",
                                "Check product availability"
                            ].map((text) => (
                                <button
                                    key={text}
                                    className="px-4 py-3 text-[11px] border border-black/10 rounded-lg
                     hover:border-black/30 hover:bg-black/[0.02]
                     transition text-black/80"
                                    onClick={() => setInput(text)}
                                >
                                    {text}
                                </button>
                            ))}
                        </div>

                        
                        <p className="text-[11px] text-black/40 mt-3">
                            Start typing your question below or choose a suggestion above.
                        </p>
                    </div>
                )}



                {/* MESSAGES */}
                <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-4 bg-white">
                    {messages.map((msg, i) => (
                        <div key={i} className="flex flex-col gap-2">

                            {/* USER MESSAGE */}
                            <div className="flex justify-end">
                                <div className="flex items-start gap-2 max-w-[75%]">
                                    <div className="bg-black text-white text-[12px] px-3 py-2 rounded shadow-sm">
                                        {msg.user}
                                        
                                    </div>
                                    <Label>
                                        <FaUserAlt className="text-white bg-black p-1 rounded-full text-[18px]" />
                                    </Label>

                                </div>
                            </div>

                            {/* BOT MESSAGE */}
                            <div className="flex justify-start">
                                <div className="flex items-start gap-2 max-w-[75%]">
                                    <Label>
                                        <RiRobot2Fill className="text-white bg-green-600 p-1 rounded-full text-[18px]" />
                                    </Label>
                                    <div className="bg-gray-200 text-black text-[12px] px-3 py-2 rounded shadow-sm min-h-[30px] flex flex-col items-start">
                                        {msg.bot ? (
                                            <ReactMarkdown>
                                                {msg.bot}
                                                </ReactMarkdown>
                                        ) : i === messages.length - 1 && loading ? (
                                            <PulseLoader margin={1} size={5} speedMultiplier={1} />
                                        ) : null}
                                    </div>

                                </div>
                            </div>

                        </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>

                {/* INPUT BAR */}
                <div className="grid w-full gap-1 p-1">
                    <Textarea

                        className="flex-1 border-gray-300 rounded px-3 py-2 "
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                    />
                    <Button
                        onClick={sendMessage}
                        className="bg-black rounded hover:bg-black/70 text-white px-4"
                    >
                        Send Message
                    </Button>
                </div>


            </motion.div>
        </AnimatePresence>

    );
}
