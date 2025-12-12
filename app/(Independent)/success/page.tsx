'use client'; // must be a client component to use useState/useEffect

import React, { useState, useEffect } from 'react';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SuccessPayment = () => {
    const [count, setCount] = useState(5); 
    const router = useRouter();

    useEffect(() => {
        if (count === 0) {
            router.push('/'); 
            return;
        }

        const timer = setTimeout(() => {
            setCount(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer); 
    }, [count, router]);

    return (
        <div className="bg-[#F1F0EE] p-1 w-full h-screen flex justify-center items-center">
            <div className='p-2 flex flex-col gap-2 justify-center items-center max-w-[400px]'>
                <div className='flex flex-col gap-1 justify-center items-center'>
                    <IoMdCheckmarkCircleOutline className='text-[40px]' />
                    <Label className='text-[17px] text-center'>Payment Successful!</Label>
                    <Label className='font-normal text-black/50 text-center'>
                        Your payment has been processed successfully. You will receive a notification email shortly.
                    </Label>
                </div>

                <div className='flex items-center gap-1 w-full justify-center py-1'>
                    <Link href='/' className='border border-black rounded p-2 uppercase w-full text-[12px] text-center'>
                        Go to Homepage
                    </Link>
                    <Link href='/profile/Purchase' className='border border-black bg-black text-white rounded p-2 uppercase w-full text-[12px] text-center'>
                        View Order
                    </Link>
                </div>

                <Label className='font-normal text-black/50 text-center'>
                    Redirecting in <span className='text-[#e31612]'>{count}</span> seconds...
                </Label>
            </div>
        </div>
    );
};

export default SuccessPayment;
