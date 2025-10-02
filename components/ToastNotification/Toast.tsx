"use client";
import React from 'react'
import { ClipLoader } from 'react-spinners';
import { useToast } from '@/stores/toastStore';
import { FaCircleCheck } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { RiErrorWarningFill } from "react-icons/ri";

const Toast = () => {
    const toastState = useToast((state) => state.toastState)
    const toastStatus = useToast((state) => state.toastStatus)
    const router = useRouter()
    const openCartToggle = useCartStore((state) => state.openCartToggle)
    const retryAddtoCart = useCartStore((state) => state.retryAddtoCart)
    const ToastStatus = () => {
        switch (toastStatus) {
            case 'success':
                return <>
                    <FaCircleCheck />
                    <label htmlFor="">Added to cart</label>
                    <button className='underline text-xs' onClick={openCartToggle}>View</button>
                </>


            case 'failed':
                return <>
                    <FaTimesCircle />
                    <label htmlFor="">Someting is wrong</label>
                    <button className='underline text-xs' onClick={retryAddtoCart}>Retry</button>
                </>

            case 'notLogin':
                return <>
                    <RiErrorWarningFill />
                    <label htmlFor="">Please Signin first</label>
                    <button className='underline text-xs' onClick={() => router.push('/login')}>signin</button>
                </>

            default:
                return <>
                    <ClipLoader
                        color='white'
                        size={20}
                    />
                    <label htmlFor="">Adding item to cart...</label>
                    <button className='text-white/0'>l</button>
                </>

        }
    }


    return (
        <div className={`${toastState ? `absolute fixed w-[500px] h-[50px] ${toastStatus == 'failed' ? 'bg-red-400' : `${toastStatus=='success'?'bg-green-400':'bg-amber-400'}`} top-20 right-2 z-50 rounded-[10px]` : 'hidden'} `}>
            <div className='relative flex justify-around items-center h-full text-white'>
                <ToastStatus />

            </div>

        </div>
    )
}

export default Toast
