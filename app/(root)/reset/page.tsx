"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LiaTimesSolid } from "react-icons/lia";
import { Button } from '@/components/ui/button'
import { ClipLoader } from 'react-spinners';
type reset_logs = {
    id: number;
    email: string;
    reset_token: string;
    expired_at: Date
}
const ResetPage = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token')
    const router = useRouter()
    const [user, setUser] = useState<reset_logs>()
    const [newpass, setNewpass] = useState('')
    const [message, setMessage] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const verifyToken = async () => {
            const checkToken = await fetch('/api/forgotpassword/checkToken', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ token: token })
            })
            const response = await checkToken.json()
            console.log(response.status)
            if (response.status !== 500) {
                console.log(response.result)
                setUser(response.result[0])
            }
            else {
                router.push('/hahahaha')
            }
        }
        verifyToken()
    }, [])

    const submitNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const submitNew = await fetch('/api/forgotpassword/submitNewPassword', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: user?.email, newpassword: newpass, token: user?.reset_token, expired: user?.expired_at })
        })
        const result = await submitNew.json()
        if (result.status == 500) {
            setLoading(false)
        } else {
            setMessage(true)
            setLoading(false)
            setTimeout(()=>{
                router.push('/login')
            },1000)
        }
    }
    return (
        <div className='w-screen h-[70vh] flex'>
            <div className="flex w-max max-w-sm flex-col gap-3 m-auto">
                <div className="px-4 py-10 rounded-xl relative bg-black inset-shadow-sm inset-shadow-white/50 w-[300px] flex flex-col gap-3">
                    <Label className='text-white text-[18px] text-center w-full  flex justify-center py-1' htmlFor="">RESET PASSWORD</Label>
                    <button className='absolute top-0 right-0'><LiaTimesSolid /></button>
                    <form onSubmit={submitNewPassword} className="flex flex-col gap-3 text-white">
                        {message && <div className='text-[#30B467] text-[13px] p-2 bg-[#A9F0AC] border border-[#30B467] rounded-[10px] text-center flex item-center justify-center'>Your new password is set!</div>}
                        <div className="w-full flex flex-col gap-1">
                            <Label htmlFor="">Email</Label>
                            <Input value={user?.email ?? ""} disabled type="email" required placeholder="Email" name='email' className='bg-[#161616]' />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <Label htmlFor="">New Password</Label>
                            <Input onChange={(e) => setNewpass(e.target.value)} type="password" required placeholder="New Password" name='password' className='bg-[#161616]' />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <Button type='submit' variant={'secondary'}>{loading && <ClipLoader color='black'
                                size={20} />}Submit</Button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default ResetPage
