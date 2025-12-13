"use client";
import React from 'react'
import { ClipLoader } from 'react-spinners';
import { useToast } from '@/stores/toastStore';
import { FaCircleCheck } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { RiErrorWarningFill } from "react-icons/ri";
import { Spinner } from "@/components/ui/spinner"
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
                    <div className='relative bg-white border border-black/10 rounded flex justify-around items-center h-full text-black'>
                        <Spinner />
                        <label htmlFor="">Adding item to cart...</label>
                        <button className='text-black/0'>l</button>
                    </div>

                </>

        }
    }


    return (
        <>
            {
                toastState &&
                <div className={`absolute fixed w-[70%] md:w-[500px] h-[50px] top-11 md:top-20 right-[2px] md:right-2 z-50 rounded-[10px] `}>
                    <ToastStatus />
                </div>
            }

        </>

    )
}

export default Toast
