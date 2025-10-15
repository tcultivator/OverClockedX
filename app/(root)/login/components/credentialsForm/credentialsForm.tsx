"use client"
import React from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doCredentialsSignin } from '../../actions/doCredentialsSignin';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';
import { useAlertNotification } from '@/stores/alertNotificationStore';
import { alertClasses } from '@/utils/alertNotificationTypes';
import { useLoading } from '@/stores/loadingStore';
const CredentialsForm = () => {
    const navigate = useRouter()

    //zustand state for loading in button
    const buttonLoading = useLoading((state) => state.buttonLoading)
    const setButtonLoading = useLoading((state) => state.setButtonLoading)
    //zustand state for alert notification in forms
    const alertNotif = useAlertNotification((state) => state.alertNotif)
    const setAlertNotif = useAlertNotification((state) => state.setAlertNotif)

    async function submitCredentialsSignin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formdata = new FormData(e.currentTarget)
        setButtonLoading(true)
        try {
            const result = await doCredentialsSignin(formdata)
            if (result.error) {
                setAlertNotif({ display: true, message: 'Failed to sign in with credentials, please try again!', alertType: 'error' })
            }
            setAlertNotif({ display: true, message: 'Signin success full, Redirecting to signin', alertType: 'success' })
            setButtonLoading(false)
            setTimeout(() => {
                navigate.push('/profile')
            }, 1000);
        } catch (err) {
            setAlertNotif({ display: true, message: 'Something went wrong, please try again!', alertType: 'error' })
            setButtonLoading(false)
        }
    }
    return (

        <div>
            <form onSubmit={submitCredentialsSignin} className="flex flex-col gap-3 text-white">
                {alertNotif.display &&
                    <div className={`${alertClasses[alertNotif.alertType]}`}>{alertNotif.message}</div>
                }
                <div className="w-full ">
                    <Label htmlFor="">Email</Label>
                    <Input type="email" required placeholder="Email" name='email' className='bg-[#161616]' />
                </div>
                <div className="w-full">
                    <Label htmlFor="">Password</Label>
                    <Input type="password" required placeholder="Password" name='password' className='bg-[#161616]' />
                </div>
                <div className='w-full flex justify-end '>
                    <Link className='underline text-blue-400 text-[13px]' href={'/forgotpassword'}>forgot password</Link>
                </div>
                <Button type='submit' variant={'secondary'} className="">{buttonLoading && (
                    <ClipLoader
                        color='black'
                        size={20}
                    />
                )}
                    {buttonLoading ? "Please Wait..." : "Signin"}</Button>
            </form>

        </div>
    )
}

export default CredentialsForm
