"use client";
import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import { useLoading } from '@/stores/loadingStore';
import { useAlertNotification } from '@/stores/alertNotificationStore';
import { alertClasses } from '@/utils/alertNotificationTypes';

const SignupForm = () => {
    //this is the state for user input in form
    const [userInput, setUserInput] = useState<string[]>([])
    //zustand state for loading in button
    const buttonLoading = useLoading((state) => state.buttonLoading)
    const setButtonLoading = useLoading((state) => state.setButtonLoading)
    //zustand state for alert notification in forms
    const alertNotif = useAlertNotification((state) => state.alertNotif)
    const setAlertNotif = useAlertNotification((state) => state.setAlertNotif)

    const submitSignupForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setButtonLoading(true)
        if (userInput[1] != userInput[2]) {
            setAlertNotif({ display: true, message: 'Passwords not match', alertType: 'warning' })
            setButtonLoading(false)
            return
        }
        const submitForm = await fetch('/api/signup/initialSignup', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: userInput[0], password: userInput[1] })
        })
        const result = await submitForm.json()
        switch (result.status) {
            case 409:
                setAlertNotif({ display: true, message: 'Accounts already exists', alertType: 'warning' })
                break;

            case 200:
                setAlertNotif({ display: true, message: 'Confirmation link is sent to your email, please confirm your account', alertType: 'success' })
                break;

            default:
                setAlertNotif({ display: true, message: 'Something went wrong please try again', alertType: 'error' })
                break;
        }

        setButtonLoading(false)

    }
    return (
        <div>
            <form onSubmit={submitSignupForm} className="flex flex-col gap-3 text-white">
                {alertNotif.display &&
                    <div className={`${alertClasses[alertNotif.alertType]}`}>{alertNotif.message}</div>
                }
                <div className="w-full ">
                    <Label >Email</Label>
                    <Input value={userInput[0] ?? ''} onChange={(e) => {
                        const email = e.target.value;
                        setUserInput([email, userInput[1], userInput[2]]);

                    }} type="email" required placeholder="Email" id='email' className='bg-[#161616]' />
                </div>
                <div className="w-full">
                    <Label >Password</Label>
                    <Input value={userInput[1] ?? ''} onChange={(e) => {
                        const password = e.target.value;
                        setUserInput([userInput[0], password, userInput[2]]);
                    }} type="password" required placeholder="Password" id='password' className='bg-[#161616]' />
                </div>

                <div className="w-full">
                    <Label>Confirm Password</Label>
                    <Input value={userInput[2] ?? ''} onChange={(e) => {
                        const confirmPass = e.target.value;
                        setUserInput([userInput[0], userInput[1], confirmPass]);
                    }} type="password" required placeholder="Confirm Password" id='confirmpassword' className='bg-[#161616]' />
                </div>
                <Button type='submit' variant={'secondary'} className="">{buttonLoading && (
                    <ClipLoader
                        color='black'
                        size={20}
                    />
                )}
                    {buttonLoading ? "Please Wait..." : "Signup"}</Button>
            </form>


        </div>
    )
}

export default SignupForm
