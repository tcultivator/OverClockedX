"use client"
import React from 'react'
import Image from 'next/image';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { LuCircleChevronLeft } from "react-icons/lu";
import { LuCircleChevronRight } from "react-icons/lu";
type Props = {
    product_id: string;
    product_image: string;
    description: string;
    brand: string;
    product_name: string;
    price: number;
    stocks: number;
}

type GcashCB = {
    referenceId: string;
    actions: {
        url: string
    }[];
}
const CheckoutProduct = ({ product_id, product_image,
    description,
    brand,
    product_name,
    price,
    stocks }: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [paymentOptions, setPaymentOptions] = useState('Gcash');


    // checkout using gcash payment
    const CheckoutProduct = async () => {
        switch (paymentOptions) {
            case 'Gcash':
                setLoading(true)
                const res = await fetch('/api/create-gcash-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: price,
                        referenceId: 'txn-' + Date.now(),
                        phoneNumber: '09171234567',
                    }),
                });


                const result = await res.json()
                console.log('eto ung lalagyan ng mga types', result)
                const data = result as GcashCB
                const insertOrders = await fetch('/api/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        reference_id: data.referenceId,
                        product_id: product_id,
                        amount: price,
                        quantity: 1,
                        payment_status: 'pending',
                        order_status: 'pending'
                    }),
                })
                const insertOrdersDone = await insertOrders.json()
                console.log("eto laman ng inser orderr ", insertOrdersDone)
                if (insertOrdersDone.status == 200) {
                    setLoading(false)
                    router.push(data.actions[0].url);
                }

                break;
            case 'Maya':
                alert('this feature is not ready yet, please select Gcash as payment options')
                break
            case 'CreditCard':
                alert('this feature is not ready yet, please select Gcash as payment options')
                break

            default:
                alert('please select payment options to continue!')
                break;
        }




    }
    return (
        <div className='px-2'>
            <div className=" w-full flex-column gap-2 sm:flex flex-row">
                <div className="w-full text-white h-full p-2 bg-black rounded-[10px] sm:w-[50%] p-10">
                    <div className=' rounded-[10px] bg-[#1E1E1E] relative'>
                        <Image
                            src={product_image}
                            width={500}
                            height={500}
                            alt=''
                            className="w-[90%] m-auto"
                        />
                        <div className="w-full flex p-3 justify-between text-4xl absolute top-[50%] transform -translate-y-1/2 text-white">
                            <button><LuCircleChevronLeft /></button>
                            <button ><LuCircleChevronRight /></button>
                        </div>
                    </div>
                </div>
                <div className="w-full text-white flex flex-col gap-3 p-2 bg-black rounded-[10px] sm:w-[50%] p-10 ">
                    <label htmlFor="">{brand}</label>
                    <label className="text-[20px] font-anton md:text-[20px] lg:text-[30px] xl:text-[40px] 2xl:text-[50px]">{product_name}</label>
                    <label className="text-[25px] font-anton md:text-[15px] lg:text-[35px] xl:text-[45px] 2xl:text-[55px]">₱{price}</label>
                    <label className="text-lg">Stocks: <span>{stocks}</span></label>
                    <label htmlFor="">Payment Options</label>
                    <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentOptions(e.target.value)} name="" id="" className="p-1 border border-white/50">
                        <option disabled>Payment Options</option>
                        <option value="Gcash">Gcash</option>
                        <option value="Maya">Maya</option>
                        <option value="CreditCard">Credit Card</option>
                    </select>
                    <div className="flex gap-5">
                        <div className="flex gap-2 bg-black border border-gray-500 w-max p-2 px-4 rounded-[25px]">
                            <button className="text-white"  ><FaMinus /></button>
                            <input type="number" className=" text-white px-1 w-[50px] text-center outline-none" placeholder="0" />
                            <button className="text-white" ><FaPlus /></button>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-2'>
                        <button disabled={loading === true} onClick={() => console.log('eto ung selected payment options, ', paymentOptions)} className="border white rounded-[25px] p-4 flex gap-2 items-center justify-center">Add to Cart</button>
                        <button onClick={() => {
                            CheckoutProduct()
                        }} className='bg-white text-black rounded-[25px] p-4 flex gap-2 items-center justify-center' disabled={loading === true}> {loading && (
                            <ClipLoader

                                color='white'
                                size={20}
                            />
                        )}
                            {loading ? "Please Wait..." : "Checkout"}</button>
                    </div>



                    <h1 className="font-bold">Description</h1>
                    <p className='font-thin md:text-[12px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]'>{description}</p>


                </div>
            </div>
        </div>
    )
}

export default CheckoutProduct
