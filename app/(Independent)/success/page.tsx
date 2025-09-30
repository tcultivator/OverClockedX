import React from 'react'
import Link from 'next/link'
const SuccessPayment = () => {
    return (
        <div className='z-40 bg-black flex flex-col justify-start gap-1 items-center w-screen h-screen p-5'>
            <div className='flex flex-col p-10 bg-white rounded text-black gap-5'>
                <h1 className=' text-5xl text-center items-center'>Thankyou for purchasing</h1>
                <Link href={"/"} className='underline text-blue-400 text-center items-center'>Go home</Link>
            </div>
        </div>
    )
}

export default SuccessPayment
