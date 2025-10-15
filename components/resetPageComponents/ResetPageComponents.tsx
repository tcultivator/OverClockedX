"use client"
import React from 'react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LiaTimesSolid } from "react-icons/lia";
import { Button } from '@/components/ui/button'
import { ClipLoader } from 'react-spinners';
import { useLoading } from '@/stores/loadingStore';
import { useAlertNotification } from '@/stores/alertNotificationStore';
import { alertClasses } from '@/utils/alertNotificationTypes';
import { use } from 'react'
type reset_logs = {
    id: number;
    email: string;
    reset_token: string;
    expired_at: Date
}
const ResetPageComponents = ({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>
}) => {
    const params = use(searchParams)
    const token = params.token
    const router = useRouter()
    const [user, setUser] = useState<reset_logs>()
    const [newpass, setNewpass] = useState('')


    //zustand state for loading in button
    const buttonLoading = useLoading((state) => state.buttonLoading)
    const setButtonLoading = useLoading((state) => state.setButtonLoading)
    //zustand state for alert notification in forms
    const alertNotif = useAlertNotification((state) => state.alertNotif)
    const setAlertNotif = useAlertNotification((state) => state.setAlertNotif)

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
        setButtonLoading(true)
        const submitNew = await fetch('/api/forgotpassword/submitNewPassword', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: user?.email, newpassword: newpass, token: user?.reset_token, expired: user?.expired_at })
        })
        const result = await submitNew.json()
        switch (result.status) {
            case 401:
                setAlertNotif({ display: true, message: 'Invalid Token', alertType: 'warning' })
                break;

            case 200:
                setAlertNotif({ display: true, message: 'Your new password is set! Redirecting to signin', alertType: 'success' })
                setTimeout(() => {
                    router.push('/login')
                }, 1000)
                break;

            default:
                setAlertNotif({ display: true, message: 'Something went wrong please try again', alertType: 'error' })
                break;
        }
        setButtonLoading(false)

    }
    return (
        <div className='w-screen h-[70vh] flex'>
            <div className="flex w-max max-w-sm flex-col gap-3 m-auto">
                <div className="px-4 py-10 rounded-xl relative bg-black inset-shadow-sm inset-shadow-white/50 w-[300px] flex flex-col gap-3">
                    <Label className='text-white text-[18px] text-center w-full  flex justify-center py-1' htmlFor="">RESET PASSWORD</Label>
                    <button className='absolute top-0 right-0'><LiaTimesSolid /></button>
                    <form onSubmit={submitNewPassword} className="flex flex-col gap-3 text-white">

                        {alertNotif.display &&
                            <div className={`${alertClasses[alertNotif.alertType]}`}>{alertNotif.message}</div>
                        }

                        <div className="w-full flex flex-col gap-1">
                            <Label htmlFor="">Email</Label>
                            <Input value={user?.email ?? ""} disabled type="email" required placeholder="Email" name='email' className='bg-[#161616]' />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <Label htmlFor="">New Password</Label>
                            <Input onChange={(e) => setNewpass(e.target.value)} type="password" required placeholder="New Password" name='password' className='bg-[#161616]' />
                        </div>
                        <div className="w-full flex flex-col gap-1">
                            <Button type='submit' variant={'secondary'}>{buttonLoading && <ClipLoader color='black'
                                size={20} />}Submit</Button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default ResetPageComponents
