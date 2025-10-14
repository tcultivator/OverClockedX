"use client"
import React from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doCredentialsSignin } from '../../actions/doCredentialsSignin';
import { ClipLoader } from 'react-spinners';
const CredentialsForm = () => {
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useRouter()
    async function submitCredentialsSignin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formdata = new FormData(e.currentTarget)
        setLoading(true)
        try {
            const result = await doCredentialsSignin(formdata)
            if (result.error) {
                setError(true)
                setMessage(result.error)
                setTimeout(() => {
                    setMessage('')
                }, 2000);
            }
            setMessage('success signin')
            setError(false)
            setLoading(false)
            setTimeout(() => {
                navigate.push('/profile')
                setMessage('')
            }, 1000);
        } catch (err) {
            setMessage('Something went wrong. Please try again.')
            setLoading(false)
            setError(true)
            setTimeout(() => {
                setMessage('')
            }, 2000);
        }
    }
    return (

        <div>
            <form onSubmit={submitCredentialsSignin} className="flex flex-col gap-3 text-white">
                {message != '' && <div className={`${error == false ? 'text-[#30B467] text-[13px] p-2 bg-[#A9F0AC] border border-[#30B467] rounded-[10px] text-center flex item-center justify-center' : 'text-[#EF3F3F] text-[13px] p-2 bg-[#FAC0C5] border border-[#EF3F3F] rounded-[10px] text-center flex item-center justify-center'}`}>{message}</div>}
                <div className="w-full ">
                    <Label htmlFor="">Email</Label>
                    <Input type="email" required placeholder="Email" name='email' className='bg-[#161616]' />
                </div>
                <div className="w-full">
                    <Label htmlFor="">Password</Label>
                    <Input type="password" required placeholder="Password" name='password' className='bg-[#161616]' />
                </div>
                <Button type='submit' variant={'secondary'} className="">{loading && (
                    <ClipLoader
                        color='black'
                        size={20}
                    />
                )}
                    {loading ? "Please Wait..." : "Signin"}</Button>
            </form>

        </div>
    )
}

export default CredentialsForm
