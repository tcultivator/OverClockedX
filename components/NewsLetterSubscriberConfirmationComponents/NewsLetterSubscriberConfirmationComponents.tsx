"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ClockLoader } from 'react-spinners'
import Link from 'next/link'
import { Label } from '../ui/label'
import { VscWarning } from "react-icons/vsc";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { VscError } from "react-icons/vsc";

const NewsLetterSubscriberConfirmationComponents = () => {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true)
    const [type, setType] = useState<'AlreadySubscriber' | 'SuccessSubscribe' | 'ServerError' | null>(null)
    const email = searchParams.get('email') || ''
    useEffect(() => {
        
        if (email) {
            setLoading(true)
            try {
                const registerSubscriber = async () => {
                    const register = await fetch('/api/NewsLetterSubscriber/RegisterSubscriber', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({ email: email })
                    })
                    const registerResult = await register.json()
                    if (registerResult.type == 'ServerError') return
                    setType(registerResult.type)
                    
                }
                registerSubscriber()
            } catch (err) {
                setType('ServerError')
            }

        }
        setLoading(false)

    }, [])

    const StatusMessageUI = () => {
        switch (type) {
            case 'AlreadySubscriber':
                return <>
                    <div className='p-2 flex flex-col gap-2 justify-center items-center max-w-[400px]'>
                        <div className='flex flex-col gap-1 justify-center items-center'>
                            <VscWarning className='text-[40px]' />
                            <Label className='text-[17px] text-center'>Already a NewsLetter Subscriber!</Label>
                            <Label className='font-normal text-black/50 text-center'>
                                This email is already registered in our newsletter subscriber list.
                            </Label>
                        </div>

                        <div className='flex items-center gap-1 w-full justify-center py-1'>
                            <Link href='/' className='border border-black bg-black text-white rounded p-2 uppercase w-full text-[12px] text-center'>
                                Go to Homepage
                            </Link>
                        </div>


                    </div>
                </>



            case 'SuccessSubscribe':
                return <>
                    <div className='p-2 flex flex-col gap-2 justify-center items-center max-w-[400px]'>
                        <div className='flex flex-col gap-1 justify-center items-center'>
                            <IoMdCheckmarkCircleOutline className='text-[40px]' />
                            <Label className='text-[17px] text-center'>Successfully Subscribe to News Letter!</Label>
                            <Label className='font-normal text-black/50 text-center'>
                                You can now receive news, updates, and special offers directly to your email.
                            </Label>
                        </div>

                        <div className='flex items-center gap-1 w-full justify-center py-1'>
                            <Link href='/' className='border border-black bg-black text-white rounded p-2 uppercase w-full text-[12px] text-center'>
                                Go to Homepage
                            </Link>
                        </div>


                    </div>

                </>


            case 'ServerError':
                return <>
                    <div className='p-2 flex flex-col gap-2 justify-center items-center max-w-[400px]'>
                        <div className='flex flex-col gap-1 justify-center items-center'>
                            <VscError className='text-[40px]' />
                            <Label className='text-[17px] text-center'>Something Went Wrong!</Label>
                            <Label className='font-normal text-black/50 text-center'>
                                Something went wrong in our end, Please try again later.
                            </Label>
                        </div>

                        <div className='flex items-center gap-1 w-full justify-center py-1'>
                            <Link href='/' className='border border-black bg-black text-white rounded p-2 uppercase w-full text-[12px] text-center'>
                                Go to Homepage
                            </Link>
                        </div>


                    </div>

                </>



            default:
                return <>

                    

                </>

        }
    }
    return (
        <div className="fixed inset-0 bg-[#F1F0EE]  w-screen h-screen flex flex-col justify-center items-center z-50 text-black">
            {loading ? (
                <div className='flex flex-col gap-1 justify-center items-center'>
                    <ClockLoader size={25} color="#000000ff" />
                    <Label className='font-normal text-black/50 text-center'>
                        subscribing... Please wait...
                    </Label>
                </div>
            ) : (
                <StatusMessageUI />
            )}
        </div>

    )
}

export default NewsLetterSubscriberConfirmationComponents
