"use client"
import React from 'react'
import { Label } from '../ui/label'
import { FaLock } from "react-icons/fa6";
import { MdNotificationsActive } from "react-icons/md";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type changePasswordErrorType = {
    currentPassword?: string | null;
    newPassword?: string | null;
    passwordNotMatch?: string | null;
    serverError?: string | null;
    changePasswordSuccess?: string | null;

}

import { toast } from "sonner"

//validation
import { changePasswordValidation } from '@/Validation/profileValidation/settings/changePasswordValidation';

type count = {
    subscriber: number
}

import { useState } from 'react';
import { ClipLoader } from 'react-spinners'
const SettingsComponents = ({ checkResult, email }: { checkResult: count[], email: string | null | undefined }) => {
    const [newsLetterButtonLoading, setNewsLetterButtonLoading] = useState(false)
    const [isNewsLetterSubscriber, setisNewsLetterSubscriber] = useState(checkResult)
    const [dialogOpen, setDialogOpen] = useState(false)

    const UnsubscribeToNewsLetter = async () => {
        setNewsLetterButtonLoading(true)
        try {
            const Unsubscribe = await fetch('/api/settings/unsubscribeToNewsLetter', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            const UnsubscribeResult = await Unsubscribe.json()
            if (UnsubscribeResult.status == 500) {
                setNewsLetterButtonLoading(false)
                toast("Unsubscribing to News Letter Error", {
                    description: UnsubscribeResult.message,
                })

                return
            }

            setNewsLetterButtonLoading(false)
            setisNewsLetterSubscriber([{ subscriber: 0 }])
            toast("Successfully Unsubscribe to News Letter", {
                description: UnsubscribeResult.message,
            })
        } catch (err) {

            setNewsLetterButtonLoading(false)
            toast("Unsubscribing to News Letter Error", {
                description: "Something went wrong to your request of Unsubscribing to News Letter",
            })
        }

    }

    const SubscribeToNewsLetter = async () => {
        setNewsLetterButtonLoading(true)
        try {
            const subscribe = await fetch('/api/NewsLetterSubscriber/RegisterSubscriber', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            const subscribeResult = await subscribe.json()
            if (subscribeResult.status == 500) {
                setNewsLetterButtonLoading(false)
                
                toast("Subscribing to News Letter Error", {
                    description: "Something went wrong to your request of Subscribing to News Letter",
                })

                return
            }

            setNewsLetterButtonLoading(false)
            setisNewsLetterSubscriber([{ subscriber: 1 }])
            toast("Successfully Subscribe to News Letter", {
                description: "You can now receive news, updates, and special offers directly to your email. ",
            })
        } catch (err) {

            setNewsLetterButtonLoading(false)
            alert(err)
        }

    }

    const [currentPasswordInput, setCurrentPasswordInput] = useState('')
    const [newPasswordInput, setNewPasswordInput] = useState('')

    const submitChangePassword = async () => {
        setValidationErros([])
        setChangePasswordButtonLoading(true)
        const validation = changePasswordValidation({ currentPasswordInput, newPasswordInput })
        if (validation) {
            console.log(validation)
            console.log(validation.filter(item => item.currentPassword))
            setValidationErros(validation)
            setChangePasswordButtonLoading(false)
            return
        }
        const submiNewPassword = await fetch('/api/settings/changePassword', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: email, currentPass: currentPasswordInput, newPass: newPasswordInput })
        })
        const submiNewPasswordResult = await submiNewPassword.json()
        if (submiNewPasswordResult.status == 500) {
            setValidationErros([{ serverError: 'Something went wrong! Please try again later' }])
            setChangePasswordButtonLoading(false)
            toast("Change Password Error", {
                description: "Something went wrong to your request of changing password",
            })
            return
        }
        if (submiNewPasswordResult.status == 404) {
            setValidationErros([{ currentPassword: 'Current Password is not Correct!' }])
            setChangePasswordButtonLoading(false)
            return

        }
        setValidationErros([{ changePasswordSuccess: 'Successfully Change Password! New Password is Set!' }])
        setChangePasswordButtonLoading(false)
        setCurrentPasswordInput('')
        setNewPasswordInput('')
        toast("Successfully Change Password", {
            description: "Your new password has been set!",
        })

    }
    const [changePasswordButtonLoading, setChangePasswordButtonLoading] = useState(false)
    const [validationErrors, setValidationErros] = useState<changePasswordErrorType[] | null>(null)

    return (
        <div className='flex flex-col gap-2 w-full'>
            <div className='rounded bg-white p-2 px-3 w-full text-black flex flex-col md:flex-row gap-2 items-center  md:justify-between'>
                <div className='flex flex-col justify-center md:justify-start md:flex-row items-center gap-2'>
                    <FaLock className='text-[40px] text-black/20' />
                    <div className='flex flex-col justify-center md:justify-start'>
                        <Label className="font-medium text-center items-center flex justify-center md:justify-start w-full">Change Password</Label>
                        <p className="text-xs text-gray-500 text-center w-full">Update your account password for better security.</p>
                    </div>

                </div>

                <Dialog open={dialogOpen}>
                    <button onClick={() => setDialogOpen(true)} className="w-full flex items-center justify-center md:w-[160px] rounded-[5px] px-4 py-2 text-[12px] transition-all text-white duration-300 bg-black hover:bg-black/80">
                        CHANGE PASSWORD
                    </button>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                                Update your password here. Be sure to click Save to confirm your changes.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex flex-col  items-center justify-center w-full'>
                            {validationErrors && validationErrors.filter(item => item.changePasswordSuccess).map((data, index) => (
                                <div key={index} className=' flex items-center justify-center w-full'>
                                    <Label className='list-decimal text-[12px] text-green-400 font-normal'>- {data.changePasswordSuccess}</Label>
                                </div>
                            ))}

                        </div>
                        <div className='flex flex-col  items-center justify-center w-full'>
                            {validationErrors && validationErrors.filter(item => item.currentPassword).map((data, index) => (
                                <div key={index} className=' flex items-center justify-start w-full'>
                                    <Label className='list-decimal text-[12px] text-[#e31612] font-normal'>- {data.currentPassword}</Label>
                                </div>
                            ))}

                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="currentPass">Current Password</Label>
                                <Input onChange={(e) => setCurrentPasswordInput(e.target.value)} id='currentPass' name='currentPass' type='password' value={currentPasswordInput || ''} />
                            </div>
                            <div className='flex flex-col items-center justify-center w-full'>
                                {validationErrors && validationErrors.filter(item => item.newPassword).map((data, index) => (
                                    <div key={index} className='leading-none flex items-center justify-start w-full p-1'>
                                        <Label className='leading-none text-[12px] text-[#e31612] font-normal'>- {data.newPassword}</Label>
                                    </div>
                                ))}

                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="newPass">New Password</Label>
                                <Input onChange={(e) => setNewPasswordInput(e.target.value)} id='newPass' name='newPass' type='password' value={newPasswordInput || ''} />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button onClick={() => {
                                    setValidationErros([])
                                    setDialogOpen(false)
                                }} variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button className='flex items-center justify-center' onClick={submitChangePassword} type="button">{changePasswordButtonLoading && (
                                <ClipLoader

                                    color='white'
                                    size={15}
                                />
                            )}
                                {changePasswordButtonLoading ? "Loading..." : "Save Changes"}</Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>

            </div>
            {
                isNewsLetterSubscriber[0].subscriber > 0 ?
                    <div className='rounded bg-white p-2 px-3 w-full text-black flex flex-col md:flex-row gap-2 items-center md:justify-between'>
                        <div className='flex flex-col justify-center md:justify-start md:flex-row items-center gap-2'>
                            <MdNotificationsActive className='text-[40px] text-black/20' />

                            <div className='flex flex-col justify-center md:justify-start'>
                                <Label className="font-medium text-center items-center flex justify-center md:justify-start w-full">
                                    Unsubscribe from Newsletter
                                </Label>
                                <p className="text-xs text-gray-500 text-center w-full">
                                    Stop receiving news, updates, and promotional emails.
                                </p>
                            </div>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="w-full flex items-center justify-center md:w-[160px] rounded-[5px] px-4 py-2 text-[12px] transition-all text-white duration-300 bg-black hover:bg-black/80">
                                    {newsLetterButtonLoading && (
                                        <ClipLoader

                                            color='white'
                                            size={15}
                                        />
                                    )}
                                    {newsLetterButtonLoading ? "LOADING..." : "UNSUBSCRIBE"}
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Unsubscribe to News Letter?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        By unsubscribing, you will no longer receive updates or promotional offers from us.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={UnsubscribeToNewsLetter}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>


                    </div>
                    :
                    <div className='rounded bg-white p-2 px-3 w-full text-black flex flex-col md:flex-row gap-2 items-center md:justify-between'>
                        <div className='flex flex-col justify-center md:justify-start md:flex-row items-center gap-2'>
                            <MdNotificationsActive className='text-[40px] text-black/20' />

                            <div className='flex flex-col justify-center md:justify-start'>
                                <Label className="font-medium text-center items-center flex justify-center md:justify-start w-full">
                                    Subscribe to Newsletter
                                </Label>
                                <p className="text-xs text-gray-500 text-center w-full">
                                    Receive news, updates, and special offers directly to your email.
                                </p>
                            </div>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="w-full flex items-center justify-center md:w-[160px] rounded-[5px] px-4 py-2 text-[12px] transition-all text-white duration-300 bg-black hover:bg-black/80">
                                    {newsLetterButtonLoading && (
                                        <ClipLoader

                                            color='white'
                                            size={15}
                                        />
                                    )}
                                    {newsLetterButtonLoading ? "LOADING..." : "SUBSCRIBE"}
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Subscribe to News Letter?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Stay in the loop with new releases, important updates, and exclusive deals straight to your inbox!
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={SubscribeToNewsLetter}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>


                    </div>
            }

        </div>
    )
}

export default SettingsComponents
