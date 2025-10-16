"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'

import { useUserStore } from '@/stores/userStore'
import { Label } from '../ui/label'
import { Button } from '@/components/ui/button'
import { ClipLoader } from 'react-spinners';
import { useAlertNotification } from '@/stores/alertNotificationStore';
import { alertClasses } from '@/utils/alertNotificationTypes';
type props = {
    firstTimeSignin: boolean
}
const SetNewPassword = ({ firstTimeSignin }: props) => {
    const [display, setDisplay] = useState(false)
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')
    const router = useRouter()
    const user = useUserStore((state) => state.user)
    const [loading, setLoading] = useState(false)
    //zustand state for alert notification in forms
    const alertNotif = useAlertNotification((state) => state.alertNotif)
    const setAlertNotif = useAlertNotification((state) => state.setAlertNotif)

    useEffect(() => {
        if (firstTimeSignin) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }, [])
    const closeSetNewPassword = () => {
        setDisplay(false)
    }

    const submitNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        if (password != confirmpassword) {
            setAlertNotif({ display: true, message: 'Passwords not match', alertType: 'warning' })
            setLoading(false)
            return
        }


        try {
            const response = await fetch('/api/setUpNewPassword', {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ password: password, email: user?.email })
            })
            const result = await response.json()
            if (result.status == 200) {
                setAlertNotif({ display: true, message: 'Your password has been updated!', alertType: 'success' })

            } else {
                setAlertNotif({ display: true, message: 'Something wewnt wrong, please ty again!', alertType: 'error' })

            }
            setLoading(false)
            setTimeout(() => {
                setDisplay(false)
            }, 2000);

        } catch (err) {

        }
    }
    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Setup New secure password</AlertDialogTitle>
                        <AlertDialogDescription>
                            You&apos;re first time signin please setup new secure password!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeSetNewPassword}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            setDisplay(true)
                        }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {display &&
                <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/20 z-50'>
                    <form onSubmit={submitNewPassword} className='p-3 rounded-[7px] bg-white text-black flex flex-col gap-3 items-center'>
                        <Label className='text-[16px]' htmlFor="">Setup New Password</Label>
                        {alertNotif.display &&
                            <div className={`w-full ${alertClasses[alertNotif.alertType]}`}>{alertNotif.message}</div>
                        }
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="" className='text-black/80'>New Password</Label>
                            <Input onChange={(e) => setPassword(e.target.value)} type="password" className='border border-black/30' required />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <Label htmlFor="" className='text-black/80'>Confirm Password</Label>
                            <Input onChange={(e) => setConfirmPassword(e.target.value)} type="password" className='border border-black/30' required />
                        </div>
                        <div className='flex flex-wrap gap-1 items-center w-full justify-between box-border'>

                            <Button type='submit' className="p-2 flex gap-2 items-center justify-center w-full">{loading && (
                                <ClipLoader
                                    color='white'
                                    size={20}
                                />
                            )}
                                {loading ? "Please Wait..." : "Submit"}</Button>
                            <Button type='button' variant={'secondary'} className='p-2 flex gap-2 items-center justify-center w-full' onClick={() => {
                                setDisplay(false)
                            }}>Cancel</Button>
                        </div>
                    </form>

                </div>

            }

        </>

    )
}

export default SetNewPassword
