"use client"
import React from 'react'
import Image from 'next/image';
import { Button } from '../ui/button';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useUserStore } from '@/stores/userStore';
import { TfiShoppingCart } from "react-icons/tfi";
import { MdShoppingCartCheckout } from "react-icons/md";
import { Props } from '@/types/CheckoutPageProps'
import { useToast } from '@/stores/toastStore';
import { FaArrowLeft } from "react-icons/fa6";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { MdOutlineCancelPresentation } from "react-icons/md";
import { BsPatchCheck } from "react-icons/bs";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiPackageThin } from "react-icons/pi";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from '../ui/textarea';
import { CiCircleAlert } from "react-icons/ci";
import { PiLightbulbThin } from "react-icons/pi";

import { LuCircleAlert } from "react-icons/lu";
type Message = {
    role: "user" | "assistant";
    content: string;
};

import { RiRobot2Fill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { PulseLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown';
const CheckoutProduct = ({ id, product_id, product_image,
    description,
    brand,
    product_name,
    price,
    stocks,
    value }: Props) => {
    const router = useRouter();
    const addToSeperateItem = useCartStore((state) => state.addToSeperateItem)
    const addToCart = useCartStore((state) => state.addToCart)
    const user = useUserStore((state) => state.user)
    const [quantity, setQuantity] = useState(1)
    const toastState = useToast((state) => state.toastState)
    console.log('eto laman ng value', value)


    // ai insights
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState('');
    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = input.trim();
        // addUserMessage(userMessage);
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/AI-Insights', {
                method: 'POST',
                body: JSON.stringify({ message: userMessage, product_name: product_name }),
            });
            const data = await res.json();
            // addBotMessage(data.reply)
            setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='px-[2px] md:px-2 bg-white'>
            <div className="lg:w-[90%] xl:w-[80%] 2xl:w-[70%] mx-auto flex-column md:flex flex-row">
                <div className="w-full text-black  h-full p-2 bg-white rounded-t md:w-[50%] md:p-10   md:rounded">
                    <button className='text-[12px] flex items-center gap-1 justify-center text-black/50' onClick={() => window.history.back()}><FaArrowLeft />Back</button>
                    <div className=' rounded-[10px] relative'>
                        <Image
                            src={product_image}
                            width={500}
                            height={500}
                            alt=''
                            className="w-full m-auto sm:w-[80%] aspect-square"
                        />

                    </div>
                </div>
                <div className="w-full text-black  flex flex-col gap-3 p-2 bg-white rounded-b md:w-[50%] md:p-10  md:rounded] ">
                    <Label htmlFor="">{brand}</Label>
                    <Label className="text-[15px] font-orbitron md:text-[16px] lg:text-[20px] xl:text-[23px] 2xl:text-[25px]">{product_name}</Label>
                    {value != null &&
                        <Label className="w-max bg-[#e31612] p-2 text-white rounded"> ON SALE</Label>}
                    <div className='flex gap-2 items-center'>
                        {value != null && <Label className='text-black text-[13px]  md:text-[15px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px]'>{new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(price - Number(value))}</Label>}
                        <Label className={` ${value != null ? 'line-through text-black/30 text-[11px] md:text-[13px] lg:text-[15px] xl:text-[17px] 2xl:text-[19px]' : ' text-black text-[13px]  md:text-[15px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px]'}`}>₱{price}</Label>

                    </div>
                    <Label className="text-[11px] md:text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[17px] font-normal">{stocks} <span>items left</span></Label>

                    <div className="flex gap-5">
                        <div className="flex gap-2  border border-black/20 w-max p-2 px-4 rounded">
                            <button className="text-black" onClick={() => {
                                if (quantity > 1) {
                                    setQuantity(prev => prev - 1)
                                }
                            }}><FaMinus /></button>
                            <input disabled type="number" className=" text-black px-1 w-[50px] text-center outline-none" placeholder="0" value={quantity} />
                            <button className="text-black" onClick={() => {
                                if (stocks > quantity) {
                                    setQuantity(prev => prev + 1)
                                }

                            }}><FaPlus /></button>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-2'>
                        <button
                            disabled={toastState}
                            onClick={() => {
                                addToCart({
                                    id: id,
                                    email: user?.email,
                                    product_id: product_id,
                                    product_name: product_name,
                                    product_image: product_image,
                                    price: price,
                                    stocks: stocks,
                                    quantity: 1,
                                    value: value
                                })
                            }}

                            className="w-full flex items-center justify-center gap-1 border border-black/50  rounded-[5px] p-3 text-[13px] transition-all duration-300 bg-white hover:bg-black/30 text-black"
                        >
                            <TfiShoppingCart className='text-[18px]' />Add to Cart
                        </button>
                        <button
                            disabled={stocks < 1}
                            onClick={() => {
                                addToSeperateItem({
                                    id: id,
                                    email: user?.email,
                                    product_id: product_id,
                                    product_name: product_name,
                                    product_image: product_image,
                                    price: price,
                                    stocks: stocks,
                                    quantity: quantity,
                                    value: value
                                })
                                router.push('/checkout')
                                // CheckoutProduct()
                            }}

                            className="w-full flex items-center justify-center gap-1  rounded-[5px] p-3 text-[13px] transition-all duration-300 bg-black hover:bg-black/80 text-white"
                        >
                            <MdShoppingCartCheckout />Checkout
                        </button>


                    </div>


                    <div className='w-full grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 p-3'>
                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <div className='relative p-1 w-[50px] aspect-square flex items-center justify-center'>
                                <div className='absolute p-1 w-[25%] h-[25%] top-0 left-0 rounded-tl border-t border-l border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  top-0 right-0 rounded-tr border-t border-r border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  bottom-0 left-0 rounded-bl border-b border-l border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  bottom-0 right-0 rounded-br border-b border-r border-black/20'></div>

                                <PiPackageThin className='text-[20px] text-black/80' />
                            </div>
                            <Label className='uppercase text-black text-center text-[10px] xl:text-[12px]'>Factory Sealed</Label>
                        </div>
                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <div className='relative p-1 w-[50px] aspect-square flex items-center justify-center'>
                                <div className='absolute p-1 w-[25%] h-[25%] top-0 left-0 rounded-tl border-t border-l border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  top-0 right-0 rounded-tr border-t border-r border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  bottom-0 left-0 rounded-bl border-b border-l border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  bottom-0 right-0 rounded-br border-b border-r border-black/20'></div>

                                <CiDeliveryTruck className='text-[20px] text-black/80' />
                            </div>
                            <Label className='uppercase text-black text-center text-[10px] xl:text-[12px]'>Safe Delivery</Label>
                        </div>
                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <div className='relative p-1 w-[50px] aspect-square  flex items-center justify-center'>
                                <div className='absolute p-1 w-[25%] h-[25%] top-0 left-0 rounded-tl border-t border-l border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  top-0 right-0 rounded-tr border-t border-r border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  bottom-0 left-0 rounded-bl border-b border-l border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  bottom-0 right-0 rounded-br border-b border-r border-black/20'></div>

                                <BsPatchCheck className='text-[20px] text-black/80' />
                            </div>
                            <Label className='uppercase text-black text-center text-[10px] xl:text-[12px]'>Compatibility</Label>
                        </div>
                        <div className='flex flex-col gap-2 items-center justify-center'>
                            <div className='relative p-1 w-[50px] aspect-square  flex items-center justify-center'>
                                <div className='absolute p-1 w-[25%] h-[25%] top-0 left-0 rounded-tl border-t border-l border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  top-0 right-0 rounded-tr border-t border-r border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  bottom-0 left-0 rounded-bl border-b border-l border-black/20'></div>
                                <div className='absolute p-1 w-[25%] h-[25%]  bottom-0 right-0 rounded-br border-b border-r border-black/20'></div>

                                <MdOutlineCancelPresentation className='text-[20px] text-black/80' />
                            </div>
                            <Label className='uppercase text-black text-center text-[10px] xl:text-[12px]'>No Hidden Fees</Label>
                        </div>

                    </div>
                    {/* <h1 className="font-bold">Description</h1>
                    <p className='font-thin md:text-[12px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]'>{description}</p> */}


                </div>
            </div>
            <div className="flex lg:w-[90%] xl:w-[80%] 2xl:w-[70%] mx-auto flex-col gap-6 ">
                <Tabs defaultValue="Specifications" className='gap-3 flex flex-col'>
                    <TabsList className=' rounded border-b border-black/30'>
                        <TabsTrigger className='shadow-none' value="Specifications"><CiCircleAlert /> Specifications</TabsTrigger>
                        <TabsTrigger className='shadow-none' value="Descriptions"><CiCircleAlert /> Descriptions</TabsTrigger>
                        <TabsTrigger className='shadow-none' value="AI Insights"><PiLightbulbThin /> AI Insights</TabsTrigger>

                    </TabsList>
                    <TabsContent value="Specifications">
                        <div className='py-3 flex w-full'>
                            <div className='p-5 rounded flex flex-col gap-1 justify-center items-center border border-black/20 w-full'>
                                <LuCircleAlert className='text-[25px]' />
                                <Label>Specifications Not Available</Label>
                                <Label className='text-black/50 text-[12px]'>Technical specifications will be added soon. Please check back later for detailed product information.</Label>
                            </div>

                        </div>
                    </TabsContent>
                    <TabsContent value="Descriptions">
                        <div className='py-3'>
                            <div className='p-3 rounded flex flex-col gap-1'>
                                <Label>Description:</Label>
                                <Label className='font-light'>{description}</Label>
                            </div>

                        </div>
                    </TabsContent>
                    <TabsContent value="AI Insights">
                        <div className=" flex flex-col w-full border border-black/30 rounded">
                            {/* HEADER */}
                            <div className=' p-3 w-full border-b border-black/30'>
                                <Label>Ask about this product</Label>
                                <Label className="text-[12px] text-black/50">
                                    Chat with TechMate about {product_name}
                                </Label>
                            </div>

                            {/* EMPTY STATE */}
                            {messages.length === 0 && (
                                <div className="w-full p-5 text-center flex flex-col items-center justify-center gap-1 my-auto">
                                    <Label className="text-md text-black">
                                        Hi! I&apos;m TechMate
                                    </Label>
                                    <Label className="text-[12px] text-black/50">
                                        Ask me anything about {product_name}—specs, performance, compatibility, upgrades, or alternatives.
                                    </Label>
                                </div>
                            )}

                            {/* CHAT AREA */}
                            <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-4 bg-white">

                                {messages.map((msg, i) => (
                                    <div key={i} className="flex flex-col gap-2">

                                        {/* USER MESSAGE */}
                                        {msg.role === "user" && (
                                            <div className="flex justify-end">
                                                <div className="flex items-start gap-2 max-w-[75%]">
                                                    <div className="bg-black text-white px-3 py-2 rounded text-[12px]">
                                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                    </div>

                                                    <Label>
                                                        <FaUserAlt className="text-white bg-blue-700 p-1 rounded-full text-[18px]" />
                                                    </Label>
                                                </div>
                                            </div>
                                        )}

                                        {/* BOT MESSAGE */}
                                        {msg.role === "assistant" && (
                                            <div className="flex justify-start">
                                                <div className="flex items-start gap-2 max-w-[75%]">
                                                    <Label>
                                                        <RiRobot2Fill className="text-white bg-green-600 p-1 rounded-full text-[18px]" />
                                                    </Label>
                                                    <div className="bg-gray-200 text-black px-3 py-2 rounded text-[12px] min-h-[30px] flex flex-col items-start">
                                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                ))}

                                {/* LOADING BUBBLE */}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="flex items-start gap-2 max-w-[75%]">
                                            <Label>
                                                <RiRobot2Fill className="text-white bg-green-600 p-1 rounded text-[15px]" />
                                            </Label>

                                            <div className="bg-gray-200 text-black px-3 py-2 rounded-xl rounded shadow-sm min-h-[30px] flex items-center">
                                                <PulseLoader margin={1} size={5} speedMultiplier={1} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef}></div>
                            </div>


                            {/* INPUT + SEND */}
                            <div className="grid w-full gap-1 p-1">
                                <Input
                                    className="flex-1 border-gray-300 rounded-lg px-3 py-2"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') sendMessage();
                                    }}
                                />

                                <Button
                                    onClick={sendMessage}
                                    className="bg-black hover:bg-black/70 text-white px-4"
                                >
                                    Send Message
                                </Button>
                            </div>

                        </div>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    )
}

export default CheckoutProduct
