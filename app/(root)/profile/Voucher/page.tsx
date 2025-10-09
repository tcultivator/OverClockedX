"use client";
import { useVoucherStore } from '@/stores/voucherStore';
import React from 'react'
import { useEffect } from 'react';
import { MdContentCopy } from "react-icons/md";
import { toast } from "sonner"
const VoucherPage = () => {
    const getAllVouchers = useVoucherStore((state) => state.getAllVouchers)
    const vouchers = useVoucherStore((state) => state.vouchers)

    useEffect(() => {
        getAllVouchers()
    }, [])

    const copyToClipboard = (value:string)=>{
        navigator.clipboard.writeText(value)
        toast("Event has been created", {
          description: "Copied to clipboard",
        })
        console.log('test')
    }
    return (
        <div className='w-full p-10 bg-black inset-shadow-sm inset-shadow-white/50'>
            <div className='pb-2 border-b border-white/30 mb-2 text-2xl'>
                <h1>Vouchers</h1>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                {vouchers.map((data, index) => (
                    <div key={index} className='w-full p-3 rounded-[10px] flex-col bg-black inset-shadow-sm inset-shadow-white/50'>
                        <div className=' flex justify-between items-center'>
                            <label className='' htmlFor="">{data.type}</label>
                            <label className={`${data.is_used == false ? 'text-green-400' : 'text-red-400'}`} htmlFor="">{data.is_used == false ? 'Available' : 'Already used'}</label>
                        </div>
                        <div className='flex justify-between  px-5 py-2 items-start'>
                            <div className='flex flex-col'>
                                <label className='text-4xl' htmlFor="">{data.code}</label>
                                <label htmlFor="">{new Intl.NumberFormat('en-PH', {
                                    style: 'currency',
                                    currency: 'PHP',
                                }).format(data.amount)}</label>
                            </div>
                            <button onClick={()=>{
                                copyToClipboard(data.code)
                            }
                                }><MdContentCopy /></button>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default VoucherPage
