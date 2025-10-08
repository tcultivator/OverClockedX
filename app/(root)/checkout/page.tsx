"use client";
import React, { useEffect, useState } from 'react'
import { TbTruckDelivery } from "react-icons/tb";
import { PiPackageDuotone } from "react-icons/pi";
import { BiSolidDiscount } from "react-icons/bi";
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { RiDeleteBack2Fill } from 'react-icons/ri';
import { FaPlus, FaMinus } from "react-icons/fa6";
//import of dataset for address
import { countries } from '@/datasetAddress/country'
import { luzonProvinces } from '@/datasetAddress/province'
import { luzonPlaces } from '@/datasetAddress/citiesAndMunicipality'
import { barangaysJaen } from '@/datasetAddress/barangay'
import { useUserStore } from '@/stores/userStore';
import Image from 'next/image';
type GcashCB = {
    referenceId: string;
    actions: {
        url: string
    }[];
}
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
const Checkout = () => {
    const finalCheckoutItems = useCartStore((state) => state.finalCheckoutItems)
    const [shippingOptions, setShippingOption] = useState('delivery');
    const [shippingCost, setShippingCost] = useState(200)

    const [CODorOTC, setCODorOTC] = useState('Cash On Delivery')
    const [paymentOptions, setPaymentOptions] = useState('Gcash');
    const user = useUserStore((state) => state.user)
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const updateQuantityOfFinalCheckoutItem = useCartStore((state) => state.updateQuantityOfFinalCheckoutItem)
    const removeItemFromFinalCheckoutItems = useCartStore((state) => state.removeItemFromFinalCheckoutItems)
    useEffect(() => {
        switch (shippingOptions) {
            case 'delivery':
                setShippingCost(200)
                setCODorOTC('Cash On Delivery')
                break;
            default:
                setShippingCost(0)
                setCODorOTC('Over The Counter')
                break;
        }
    }, [shippingOptions])




    const CheckoutProduct = async () => {
        setLoading(true)
        switch (paymentOptions) {
            case 'Gcash':
                const res = await fetch('/api/create-gcash-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: finalCheckoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + shippingCost,
                        referenceId: 'txn-' + Date.now(),
                        phoneNumber: '09171234567',
                    }),
                });


                const result = await res.json()
                const data = result as GcashCB
                console.log(data)
                const insertOrders = await fetch('/api/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: user?.email,
                        referenceId: data.referenceId,
                        total_amount: finalCheckoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + shippingCost,
                        checkoutItems: finalCheckoutItems
                    }),
                })
                const insertOrdersDone = await insertOrders.json()
                console.log("eto laman ng inser orderr ", insertOrdersDone)
                if (insertOrdersDone.status == 200) {
                    router.push(data.actions[0].url);
                    setLoading(false)
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
        <div className='px-2 pb-2 text-white flex gap-2'>
            <div className='bg-black rounded-[10px] flex flex-col gap-5 p-10'>
                <h1>Checkout</h1>
                <div className='flex gap-2 items center'>
                    <div className='flex items-center justify-center gap-2 bg-[#1E1E1E] p-5 rounded-[10px] border border-white/50'>
                        <input
                            id='delivery'
                            type="radio"
                            value='delivery'
                            checked={shippingOptions == 'delivery'}
                            onChange={(e) => {
                                console.log(e.target.checked)
                                setShippingOption(e.target.value)

                            }}
                            className='cursor-pointer' />
                        <TbTruckDelivery />
                        <label htmlFor="delivery" className='cursor-pointer'>Delivery</label>
                    </div>
                    <div className='flex items-center justify-center gap-2 bg-[#1E1E1E] p-5 rounded-[10px] border border-white/50'>
                        <input
                            id='pickup'
                            type="radio"
                            value='pickup'
                            checked={shippingOptions == 'pickup'}
                            onChange={(e) => {
                                setShippingOption(e.target.value)
                            }}
                            className='cursor-pointer' />
                        <PiPackageDuotone />
                        <label htmlFor="pickup" className='cursor-pointer'>Pick up</label>
                    </div>
                </div>

                <div className='flex flex-col'>
                    <label htmlFor="">Payment Method</label>
                    <select name="" id="" className='input-Profile' onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentOptions(e.target.value)}>
                        <option value="Gcash">Gcash</option>
                        <option value="Maya">Maya</option>
                        <option value={CODorOTC}>{CODorOTC}</option>
                    </select>
                </div>

                <h1>Shipping Information</h1>
                <form>

                    <div className='flex flex-col'>
                        <label htmlFor="">Fullname</label>
                        <input type="text" className='input-Profile' />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="">Email Address</label>
                        <input type="email" className='input-Profile' />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="">Phone Number</label>
                        <input type="number" className='input-Profile' />
                    </div >

                    <div className='flex flex-col'>
                        <label htmlFor="">Country</label>
                        <input list="countries" name="countries" className='input-Profile' />
                        <datalist id='countries' className='absolute bg-white text-black'>
                            {countries.map((data, index) => (
                                <option key={index} value={data}>{data}</option>
                            ))}
                        </datalist>
                    </div>
                    <div className='flex gap-1'>

                        <div className='flex flex-col'>
                            <label htmlFor="">City/Municipality</label>
                            <input list='city' name='city' className='input-Profile' />
                            <datalist id='city'>
                                {luzonPlaces.map((data, index) => (
                                    <option key={index} value={data}>{data}</option>
                                ))}
                            </datalist>
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="">Barangay</label>
                            <input list='barangay' name='barangay' className='input-Profile' />
                            <datalist id='barangay'>
                                {barangaysJaen.map((data, index) => (
                                    <option key={index} value={data}>{data}</option>
                                ))}
                            </datalist>
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="">Province</label>
                            <input list='province' name='province' className='input-Profile' />
                            <datalist id='province'>
                                {luzonProvinces.map((data, index) => (
                                    <option key={index} value={data}>{data}</option>
                                ))}
                            </datalist>
                        </div>

                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="">Trademark</label>
                        <input type="text" className='input-Profile' />
                    </div>
                </form>
            </div>
            <div className='flex flex-col gap-5 p-10'>
                <h1>Review your cart</h1>

                <div className='flex flex-col gap-2'>
                    {finalCheckoutItems.map((data, index) => (
                        <div key={index} className='flex justify-between gap-5 p-5 items-center bg-black rounded relative'>
                            <div className='flex gap-3 items-center'>
                                <Image src={data.product_image} alt="" className='w-20 border border-white/50' width={100} height={100} />
                                <div className='flex flex-col'>
                                    <label htmlFor="">{data.product_name}</label>
                                    <label htmlFor="">{data.price}</label>
                                </div>
                            </div>
                            <div className="flex gap-2 bg-black w-max p-1 px-2 rounded text-[10px]">
                                <button onClick={() => {
                                    data.quantity > 1 &&
                                        updateQuantityOfFinalCheckoutItem(false, data.product_id)
                                }} className="text-white" ><FaMinus /></button>
                                <input disabled type="number" className=" text-white px-1 w-[20px] bg-white/30 text-center outline-none rounded p-1" value={data.quantity} />
                                <button onClick={() => {
                                    data.stocks > data.quantity &&
                                        updateQuantityOfFinalCheckoutItem(true, data.product_id)
                                }} className="text-white"><FaPlus /></button>

                            </div>
                            <button disabled={finalCheckoutItems.length <= 0} onClick={() => removeItemFromFinalCheckoutItems(data.product_id)} className='absolute top-0 right-0 text-[25px] text-red-400'><RiDeleteBack2Fill /></button>

                        </div>
                    ))}


                </div>

                <div className='flex p-2 rounded-[10px] items-center bg-white justify-between '>
                    <div className='flex gap-1 items-center'>
                        <BiSolidDiscount className='text-black/50' />
                        <input type="text" placeholder='Enter discount code' className='outline-none text-black/80' />
                    </div>
                    <button className='text-black/80'>Apply</button>
                </div>

                <div className=''>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="" className='text-white/90 font-thin'>Subtotal</label>
                        <label htmlFor="">{finalCheckoutItems.length > 0 ? new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(finalCheckoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0)) : new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(0)}</label>
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="" className='text-white/90 font-thin'>Shipping</label>
                        <label htmlFor="">{new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(shippingCost)}</label>
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="" className='text-white/90 font-thin'>Discount</label>
                        <label htmlFor="">₱0.00</label>
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="">Total</label>
                        <label htmlFor="">{finalCheckoutItems.length > 0 ? new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(finalCheckoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + shippingCost) : new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(0)}</label>
                    </div>

                </div>

                <div>
                    <button onClick={() => {
                        CheckoutProduct()
                    }} className='bg-white text-black rounded-[25px] p-2 flex gap-2 items-center justify-center w-full' disabled={loading === true}> {loading && (
                        <ClipLoader

                            color='black'
                            size={20}
                        />
                    )}
                        {loading ? "Please Wait..." : "Order Now"}</button>
                </div>


            </div>
        </div>
    )
}

export default Checkout
