"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { useLoading } from '@/stores/loadingStore'
import { useUserStore } from '@/stores/userStore'
type props = {
    firstTimeSignin: boolean
}
const SetNewPassword = ({ firstTimeSignin }: props) => {
    const [display, setDisplay] = useState(false)
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState('')
    const router = useRouter()
    const setLoading = useLoading((state) => state.setLoading)
    const user = useUserStore((state) => state.user)
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
        setLoading("Setting up new password...");

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
                setLoading('')
                setDisplay(false)
            } else {
                setLoading('')
            }
        } catch (err) {
            setLoading('')
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
                    <form onSubmit={submitNewPassword} className='p-5 rounded-[10px] bg-white text-black flex flex-col gap-2 justify-center items-center'>
                        <label htmlFor="">Setup New Password</label>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="">Password</label>
                            <Input onChange={(e) => setPassword(e.target.value)} type="password" />
                        </div>
                        <div className='flex gap-1 items-center justify-center w-full'>
                            <button type='button' className='bg-black rounded w-full text-white' onClick={() => {
                                setDisplay(false)
                            }}>Cancel</button>
                            <button type='submit' className='bg-black rounded w-full text-white' >Submit</button>
                        </div>
                    </form>

                </div>

            }

        </>

    )
}

export default SetNewPassword
