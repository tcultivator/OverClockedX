"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
const AccountConfirmation = () => {
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams();
    const token = searchParams.get('token')
    useEffect(() => {
        if (token) {
            const confirmAccountCreation = async () => {
                const confirmAccount = await fetch('api/signup/confirmAccount', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ token: token })

                })
                const result = await confirmAccount.json()
                if (result.status == 200) {
                    setLoading(false)
                } else {
                    setLoading(false)
                    console.log('something went wrong')
                }
            }
            confirmAccountCreation()
        } else {
            console.log('invalid token')
        }

    }, [])
    return (
        <div className='absolute top-0 left-0 bg-black w-screen h-screen flex justify-center items-center'>
            {loading ? <PulseLoader size={30} color='white' /> :
                <div>
                    <h1>Account is Created!</h1>
                    <Link href="/login">got to signin</Link>
                </div>
            }
        </div>
    )
}

export default AccountConfirmation
