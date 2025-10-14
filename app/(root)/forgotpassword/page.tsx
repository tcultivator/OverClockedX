"use client"
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { LiaTimesSolid } from "react-icons/lia";
import { Button } from '@/components/ui/button'
import { ClipLoader } from 'react-spinners';
const page = () => {
    const [notif, setNotif] = useState(false)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const getOldPassword = async () => {
        setLoading(true)
        const response = await fetch('/api/forgotpassword/sendResetLink', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        const result = await response.json()
        switch (result.status) {
            case 200:
                setTimeout(() => {
                    setLoading(false)
                    setNotif(true)
                    setTimeout(() => {
                        setNotif(false)
                    }, 2000)
                }, 2000)
                break;
            case 404:
                setTimeout(() => {
                    setLoading(false)
                    setNotif(true)
                    setTimeout(() => {
                        setNotif(false)
                    }, 2000)
                }, 2000)
                break;

            default:
                setTimeout(() => {
                    setLoading(false)
                    setNotif(true)
                    setTimeout(() => {
                        setNotif(false)
                    }, 2000)
                }, 2000)
                break;
        }

    }
    return (
        <div className='w-screen h-[70vh] flex'>
            <div className="flex w-max max-w-sm flex-col gap-3 m-auto">
                <div className="px-4 py-10 rounded-xl relative bg-black inset-shadow-sm inset-shadow-white/50 w-[300px] flex flex-col gap-3">
                    <Label className='text-white text-[18px] text-center w-full  flex justify-center py-1' htmlFor="">FORGOT PASSWORD</Label>
                    <button className='absolute top-0 right-0'><LiaTimesSolid /></button>
                    <div className="flex flex-col gap-3 text-white">
                        {notif && <div className='text-[#30B467] text-[13px] p-2 bg-[#A9F0AC] border border-[#30B467] rounded-[10px] text-center flex item-center justify-center'>Your reset link is sent to your email!</div>}
                        <div className="w-full flex flex-col gap-1">
                            <Label htmlFor="">Email</Label>
                            <Input onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email" name='email' className='bg-[#161616]' />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <Button onClick={() => {
                                getOldPassword()
                            }} variant={'secondary'}>{loading && <ClipLoader
                                color='black'
                                size={20}
                            />}Send Reset Link</Button>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default page
