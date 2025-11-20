"use client";
import React from 'react'
import { Label } from '../ui/label';
import Link from 'next/link';
import { FaFacebook } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { IoLocationOutline } from "react-icons/io5";
import Image from 'next/image';
import { SiRender } from "react-icons/si";
import { useState } from 'react';
const Footer = () => {
    const [subscriber_email, setSubscriber_email] = useState('')
    const [loading, setLoading] = useState(false)
    const subscribe_newsletter = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const subscribe = await fetch('/api/NewsLetterSubscriber/SendEmailRequest', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email: subscriber_email })
            })
            const subscribe_result = await subscribe.json()
            if (subscribe_result.status == 500) return
            alert('Success! Please check your email!')
        } catch (err) {
            alert('something went wrong')
        }
        setLoading(false)

    }
    return (
        <div className="bg-black p-3 md:p-10 w-full flex justify-center text-white font-Abyssinica font-thin">
            <div className="w-full xl:w-[90%] 2xl:w-[80%] flex flex-col gap-6">

                {/* Logo */}
                <Label className="text-[20px] md:text-[26px] font-bold flex justify-center md:justify-start cursor-pointer font-orbitron">
                    OverClockedX
                </Label>

                {/* Responsive grid – stacks on mobile, expands on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

                    {/* Contact */}
                    <div className="flex flex-col gap-2">
                        <Label className="">Contact</Label>
                        <div className="flex flex-col gap-2">
                            <Link href="tel:+639562656787">
                                <Label className="flex items-center gap-1 cursor-pointer font-thin">
                                    <MdLocalPhone /> +639562656787
                                </Label>
                            </Link>

                            <Link href="mailto:lpanahon06@gmail.com">
                                <Label className="flex items-center gap-1 cursor-pointer font-thin">
                                    <MdOutlineEmail /> lpanahon06@gmail.com
                                </Label>
                            </Link>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col gap-2">
                        <Label className="">Navigation</Label>
                        <div className="flex flex-col gap-2">
                            <Link href="/"><Label className="cursor-pointer font-thin">Home Page</Label></Link>
                            <Link href="/about"><Label className="cursor-pointer font-thin">About Page</Label></Link>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-2">
                        <Label className="">Location</Label>
                        <Link href="https://maps.app.goo.gl/y3KRFyJmuB8a5puV9" target="_blank">
                            <Label className="flex items-center gap-1 cursor-pointer font-thin">
                                <IoLocationOutline /> 8W94+683, Jaen, Nueva Ecija
                            </Label>
                        </Link>
                    </div>

                    {/* Social Media */}
                    <div className="flex flex-col gap-2">
                        <Label className="">Social Media</Label>
                        <div className="flex gap-3 items-center">
                            <Link href="https://www.facebook.com/" target='_blank'><FaFacebook className="text-[19px] font-thin" /></Link>
                            <Link href="https://www.instagram.com/" target='_blank'><RiInstagramFill className="text-[22px] font-thin" /></Link>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col gap-2 ">
                        <Label className="">Newsletter</Label>
                        <form onSubmit={subscribe_newsletter} className="flex flex-col gap-2">
                            <Label className="font-thin text-white/80">
                                Get regular updates on our products with our newsletter.
                            </Label>
                            <Input onChange={(e) => setSubscriber_email(e.target.value)}
                                type="email"
                                className="border border-white/50 p-5 rounded-[5px] "
                                placeholder="Email"
                                required
                            />
                            <Button disabled={loading} type="submit" className="p-5 rounded-[5px]" variant="secondary">{loading ? 'Loading' : 'Subscribe'}</Button>
                        </form>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full border-b-[2px] border-white/40 rounded"></div>

                {/* Bottom Section */}
                <div className="flex  justify-between items-center gap-3">

                    <Label>&copy; 2025 OverClockedX</Label>

                    <div className="flex items-center gap-3">
                        <Image
                            src="/gcashIcon.png"
                            width={100}
                            height={100}
                            alt="GCash"
                            className="h-3 md:h-5 w-auto"
                        />
                        <Image
                            src="/mayaIcon.png"
                            width={100}
                            height={100}
                            alt="Maya"
                            className="h-2 md:h-4 w-auto mt-1"
                        />
                    </div>
                </div>

                {/* Hosting */}
                <div className="w-full text-center flex justify-center">
                    <Label className="flex items-center gap-1">
                        Hosting by <SiRender />Render
                    </Label>
                </div>
            </div>
        </div>

    )
}

export default Footer
