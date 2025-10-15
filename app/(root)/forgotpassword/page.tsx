"use client"
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { LiaTimesSolid } from "react-icons/lia";
import { Button } from '@/components/ui/button'
import { ClipLoader } from 'react-spinners';
import { useLoading } from '@/stores/loadingStore';
import { useAlertNotification } from '@/stores/alertNotificationStore';
import { alertClasses } from '@/utils/alertNotificationTypes';
const ForgotPassword = () => {
    const [email, setEmail] = useState('')

    //zustand state for loading in button
    const buttonLoading = useLoading((state) => state.buttonLoading)
    const setButtonLoading = useLoading((state) => state.setButtonLoading)
    //zustand state for alert notification in forms
    const alertNotif = useAlertNotification((state) => state.alertNotif)
    const setAlertNotif = useAlertNotification((state) => state.setAlertNotif)

    const sendResetLink = async () => {
        setButtonLoading(true)
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
                setAlertNotif({ display: true, message: 'Your reset link was successfully sent to your provided email!', alertType: 'success' })
                break;
            case 404:
                setAlertNotif({ display: true, message: 'No account found to the email provided!', alertType: 'warning' })
                break;

            default:
                setAlertNotif({ display: true, message: 'Something went wrong, please try again!', alertType: 'error' })
                break;
        }
        setButtonLoading(false)

    }
    return (
        <div className='w-screen h-[70vh] flex'>
            <div className="flex w-max max-w-sm flex-col gap-3 m-auto">
                <div className="px-4 py-10 rounded-xl relative bg-black inset-shadow-sm inset-shadow-white/50 w-[300px] flex flex-col gap-3">
                    <Label className='text-white text-[18px] text-center w-full  flex justify-center py-1' htmlFor="">FORGOT PASSWORD</Label>
                    <button className='absolute top-0 right-0'><LiaTimesSolid /></button>
                    <div className="flex flex-col gap-3 text-white">
                        {alertNotif.display &&
                            <div className={`${alertClasses[alertNotif.alertType]}`}>{alertNotif.message}</div>
                        }
                        <div className="w-full flex flex-col gap-1">
                            <Label htmlFor="">Email</Label>
                            <Input onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email" name='email' className='bg-[#161616]' />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <Button onClick={() => {
                                sendResetLink()
                            }} variant={'secondary'}>{buttonLoading && <ClipLoader
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

export default ForgotPassword
