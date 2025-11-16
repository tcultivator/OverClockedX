"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import Link from 'next/link'
const NewsLetterSubscriberConfirmationComponents = () => {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<number>(500)
    const email = searchParams.get('email') || ''
    useEffect(() => {
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
                if (registerResult.status == 500) return
                setStatus(registerResult.status)
            }
            registerSubscriber()
        } catch (err) {
            setStatus(500)
        }
        setLoading(false)
    }, [])
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 w-screen h-screen flex flex-col justify-center items-center z-50 text-white">
            {loading ? (
                <>
                    <PulseLoader size={15} color="#ffffff" />
                    <p className="mt-4 text-lg">Subscribing, please wait...</p>
                </>
            ) : status === 200 ? (
                /* SUCCESS */
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-4">🎉 Successfully Subscribed!</h1>
                    <p className="mb-2">You will now receive product updates through your email.</p>
                    <Link
                        href="/"
                        className="inline-block mt-3 px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
                    >
                        Go Home
                    </Link>
                </div>
            ) : status === 201 ? (
                /* ALREADY SUBSCRIBED */
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-4">ℹ️ Youre Already Subscribed</h1>
                    <p className="mb-2">Your email is already in our newsletter list.</p>
                    <Link
                        href="/"
                        className="inline-block mt-3 px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
                    >
                        Go Home
                    </Link>
                </div>
            ) : (
                /* ERROR (500, or any other unexpected status) */
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-4">❌ Something Went Wrong</h1>
                    <p className="mb-2">Unable to register to our newsletter.</p>
                    <Link
                        href="/"
                        className="inline-block mt-3 px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
                    >
                        Go Home
                    </Link>
                </div>
            )}
        </div>

    )
}

export default NewsLetterSubscriberConfirmationComponents
