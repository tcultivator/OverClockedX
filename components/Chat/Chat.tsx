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
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown';
import { IoSend } from "react-icons/io5"; 

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


    // send message to chatgpt, 
    const sendMessage = async () => {
        // this check if has user input, the loading state will prevent user to submit message while loading
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
            addBotMessage('Something went wrong! Please Try Again Later')
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence mode='wait'>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
               
                className="bg-white text-zinc-800 border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 
                w-[320px] h-[500px] 
                lg:w-[330px] lg:h-[470px] 
                xl:w-[350px] xl:h-[500px] 
                2xl:w-[400px] 2xl:h-[550px]"
            >

               
                <div className="flex justify-between items-center px-4 py-3 bg-zinc-900 text-white shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/10 p-1.5 rounded-full">
                            <RiRobot2Fill className="text-emerald-400 text-lg" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <Label className="font-semibold text-sm cursor-pointer text-white">Techmate</Label>
                            <span className="text-[10px] text-zinc-400 font-medium">AI Assistant</span>
                        </div>
                    </div>
                    <Button
                        onClick={() => setOpenChat(false)}
                        variant="ghost"
                        size="icon"
                        className="text-white/60 hover:text-white hover:bg-white/10 h-8 w-8 rounded-full transition-colors"
                    >
                        <LiaTimesSolid className="text-lg" />
                    </Button>
                </div>

                {/* intro if no message yet with template of message*/}
                {messages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50/50">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-zinc-900">
                            <RiRobot2Fill className="text-2xl" />
                        </div>

                        <h2 className="text-sm font-bold text-zinc-900 mb-1">
                            How can I help you today?
                        </h2>

                        <p className="text-xs text-zinc-500 max-w-[200px] mb-6 leading-relaxed">
                            Ask about products, recommendations, or services.
                        </p>

                        <div className="flex flex-col gap-2 w-full">
                            {[
                                "Recommend a product",
                                "Best selling products",
                                "Latest laptops",
                                "Check availability"
                            ].map((text) => (
                                <button
                                    key={text}
                                    className="px-4 py-2.5 text-xs font-medium text-left bg-white border border-gray-200 rounded-lg shadow-sm
                                    hover:border-zinc-300 hover:shadow-md hover:translate-x-1 transition-all duration-200 text-zinc-700"
                                    onClick={() => setInput(text)}
                                >
                                    {text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* messages */}
                {messages.length > 0 && (
                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50">
                        {messages.map((msg, i) => (
                            <div key={i} className="flex flex-col gap-1">
                               {/* user message */}
                                <div className="flex justify-end w-full">
                                    <div className="flex items-end gap-2 max-w-[85%] flex-row-reverse">
                                        <div className="flex-shrink-0 w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center shadow-sm">
                                            <FaUserAlt className="text-white text-[10px]" />
                                        </div>
                                        <div className="bg-zinc-900 text-white text-xs px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm leading-relaxed">
                                            {msg.user}
                                        </div>
                                    </div>
                                </div>

                                {/* bot message */}
                                <div className="flex justify-start w-full">
                                    <div className="flex items-start gap-2 max-w-[85%]">
                                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center shadow-sm mt-1">
                                            <RiRobot2Fill className="text-white text-[12px]" />
                                        </div>
                                        <div className="bg-white text-zinc-800 border border-gray-200 text-xs px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm leading-relaxed w-full">
                                            {msg.bot ? (
                                                <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 text-zinc-800">
                                                    <ReactMarkdown>
                                                        {msg.bot}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : i === messages.length - 1 && loading ? (
                                                <div className="py-1">
                                                    <PulseLoader color="#10b981" margin={2} size={4} speedMultiplier={0.8} />
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>
                )}

              
                <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                    <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 focus-within:ring-2 focus-within:ring-zinc-900/5 focus-within:border-zinc-300 transition-all">
                        <Textarea
                            className="flex-1 min-h-[40px] max-h-[100px] border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm placeholder:text-zinc-400 py-2.5 resize-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && !loading) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <Button
                            onClick={sendMessage}
                            size="icon"
                            className={`h-9 w-9 shrink-0 rounded-lg transition-all ${input.trim() ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'bg-gray-200 text-gray-400'}`}
                            disabled={loading}
                        >
                            <IoSend className="text-sm ml-0.5" />
                        </Button>
                    </div>
                    <div className="text-center mt-1.5">
                        <span className="text-[10px] text-gray-300 font-medium">Powered by Techmate AI</span>
                    </div>
                </div>

            </motion.div>
        </AnimatePresence>
    );
}