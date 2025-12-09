import React from 'react'
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Label } from '@/components/ui/label';;
import Link from 'next/link';
const CodSuccessPage = () => {

    return (
        <div className=' p-1 w-full h-[45vh] flex justify-center items-center'>
            <div className='p-2 flex flex-col gap-1 justify-center items-center'>
                <IoMdCheckmarkCircleOutline className='text-[40px]' />
                <Label className='text-[17px] text-center'>Thank you for your order!</Label>
                <Label className='font-normal text-black/50 text-center'>Your order is successfully placed and is being proccessed.</Label>
                <div className='flex items-center gap-1  w-full justify-center py-1'>
                    <Link href={'/'} className='border border-black rounded p-2 uppercase w-full text-[12px] text-center'>Go to Homepage</Link>
                    <Link href={'/profile/Purchase'} className='border border-black bg-black text-white rounded p-2 uppercase w-full text-[12px] text-center'>View Order</Link>
                    
                </div>
            </div>

        </div>
    )
}

export default CodSuccessPage
