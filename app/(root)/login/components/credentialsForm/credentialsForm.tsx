"use client"
import React from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useRouter } from 'next/navigation';
import { doCredentialsSignin } from '../../actions/doCredentialsSignin';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';
import { useAlertNotification } from '@/stores/alertNotificationStore';
import { alertClasses } from '@/utils/alertNotificationTypes';
import { useLoading } from '@/stores/loadingStore';
import { redirect } from 'next/navigation';
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
            const result = await doCredentialsSignin(formdata);
            

            if (result.error) {
                if (result.error === "CredentialsSignin") {
                    // invalid email OR invalid password
                    setAlertNotif({
                        display: true,
                        message: "Incorrect email or password!",
                        alertType: "error",
                    });
                } else if (result.error === "SERVER_ERROR") {
                    setAlertNotif({
                        display: true,
                        message: "Something went wrong on the server!",
                        alertType: "error",
                    });
                }

                setButtonLoading(false);
                return;
            }

            // SUCCESS
            setAlertNotif({
                display: true,
                message: "Signin successful! Redirecting...",
                alertType: "success",
            });

            setButtonLoading(false);

            setTimeout(() => redirect('/profile'), 1000);
        } catch (err) {
            setAlertNotif({
                display: true,
                message: "Unexpected error occurred!",
                alertType: "error"
            });
            setButtonLoading(false);
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
                    <Input type="email" required placeholder="Email" name='email' className='text-black' />
                </div>
                <div className="w-full">
                    <Label htmlFor="">Password</Label>
                    <Input type="password" required placeholder="Password" name='password' className='text-black' />
                </div>
                <div className='w-full flex justify-end '>
                    <Link className='underline text-blue-400 text-[13px]' href={'/forgotpassword'}>forgot password</Link>
                </div>
                <Button type='submit' variant={'default'} className="uppercase">{buttonLoading && (
                    <ClipLoader
                        color='white'
                        size={20}
                    />
                )}
                    {buttonLoading ? "Please Wait..." : "Sign in"}</Button>
            </form>

        </div>
    )
}

export default CredentialsForm
