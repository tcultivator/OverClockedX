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

import { useVoucherStore } from '@/stores/voucherStore';
import Image from 'next/image';
import { toast } from 'sonner'
import { voucherTypes } from '@/types/voucherTypes';

type GcashCB = {
    referenceId: string;
    actions: {
        url: string
    }[];
}
import { MdOutlineChevronRight } from "react-icons/md";

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
const Checkout = () => {
    const finalCheckoutItems = useCartStore((state) => state.finalCheckoutItems)
    const [shippingOptions, setShippingOption] = useState('delivery');
    const [shippingCost, setShippingCost] = useState(200)

    const [CODorOTC, setCODorOTC] = useState('Cash On Delivery')
    const [paymentOptions, setPaymentOptions] = useState('');
    const user = useUserStore((state) => state.user)
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const updateQuantityOfFinalCheckoutItem = useCartStore((state) => state.updateQuantityOfFinalCheckoutItem)
    const removeItemFromFinalCheckoutItems = useCartStore((state) => state.removeItemFromFinalCheckoutItems)

    const addToUserAdress = useUserStore((state) => state.addToUserAdress)
    const userAdress = useUserStore((state) => state.userAdress)

    const [rName, setRName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [cityMunicipality, setCityMunicipality] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [barangay, setBarangay] = useState<string>('');
    const [province, setProvince] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string | number>('');


    const useCustomInput = useUserStore((state) => state.useCustomInput)
    const addCustomAddress = useUserStore((state) => state.addCustomAddress)

    const getAllVouchers = useVoucherStore((state) => state.getAllVouchers)
    const vouchers = useVoucherStore((state) => state.vouchers)
    const [voucherAmount, setVoucherAmount] = useState(0)
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

    useEffect(() => {
        getAllVouchers()
    }, [])




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

    const applyVoucher = (voucher: voucherTypes) => {
        setVoucherAmount(voucher.amount)
        toast("Event has been created", {
            description: "Discount Voucher is added successfully",
            action: {
                label: "Undo",
                onClick: () => setVoucherAmount(0),
            },
        })
    }

    return (
        <div className='px-2 pb-2 text-white flex gap-2'>
            <div className='bg-black rounded-[10px] flex flex-col gap-5 p-10 w-full inset-shadow-sm inset-shadow-white/50'>
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
                    <Select onValueChange={(value) => setPaymentOptions(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Payment Methods</SelectLabel>
                                <SelectItem value="Gcash">Gcash</SelectItem>
                                <SelectItem value="Maya">Maya</SelectItem>
                                <SelectItem value={CODorOTC}>{CODorOTC}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {/* <select name="" id="" className='input-Profile' onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentOptions(e.target.value)}>
                        <option value="Gcash">Gcash</option>
                        <option value="Maya">Maya</option>
                        <option value={CODorOTC}>{CODorOTC}</option>
                    </select> */}
                </div>
                <div className='flex items-center justify-between'>
                    <h1>Shipping Information</h1>
                    <button onClick={() => {
                        userAdress.length > 0 ? useCustomInput() :
                            addToUserAdress()
                    }} className='underline text-[12px] text-blue-400'>{userAdress.length > 0 ? 'Edit Address' : 'Use Current Address'}</button>
                </div>

                <form>

                    <div className='flex flex-col'>
                        <label htmlFor="">Fullname</label>
                        <Input required disabled={userAdress.length > 0} type="text" value={userAdress[0]?.rname ?? rName} onChange={(e) => setRName(e.target.value)} />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="">Email Address</label>
                        <Input disabled={userAdress.length > 0} type="email" value={userAdress[0]?.email ?? email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="">Phone Number</label>
                        <Input disabled={userAdress.length > 0} type="number" value={userAdress[0]?.phone_number ?? phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div >

                    <div className='flex flex-col'>
                        <label htmlFor="">Country</label>
                        <Input disabled={userAdress.length > 0} list="countries" name="countries" value={userAdress[0]?.country ?? country} onChange={(e) => setCountry(e.target.value)} />
                        <datalist id='countries' className='absolute bg-white text-black'>
                            {countries.map((data, index) => (
                                <option key={index} value={data}>{data}</option>
                            ))}
                        </datalist>
                    </div>
                    <div className='flex gap-1'>

                        <div className='flex flex-col w-full'>
                            <label htmlFor="">City/Municipality</label>
                            <Input disabled={userAdress.length > 0} list='city' name='city' value={userAdress[0]?.cityMunicipality ?? cityMunicipality} onChange={(e) => setCityMunicipality(e.target.value)} />
                            <datalist id='city'>
                                {luzonPlaces.map((data, index) => (
                                    <option key={index} value={data}>{data}</option>
                                ))}
                            </datalist>
                        </div>

                        <div className='flex flex-col w-full'>
                            <label htmlFor="">Barangay</label>
                            <Input disabled={userAdress.length > 0} list='barangay' name='barangay' value={userAdress[0]?.barangay ?? barangay} onChange={(e) => setBarangay(e.target.value)} />
                            <datalist id='barangay'>
                                {barangaysJaen.map((data, index) => (
                                    <option key={index} value={data}>{data}</option>
                                ))}
                            </datalist>
                        </div>

                        <div className='flex flex-col w-full'>
                            <label htmlFor="">Province</label>
                            <Input disabled={userAdress.length > 0} list='province' name='province' value={userAdress[0]?.province ?? province} onChange={(e) => setProvince(e.target.value)} />
                            <datalist id='province'>
                                {luzonProvinces.map((data, index) => (
                                    <option key={index} value={data}>{data}</option>
                                ))}
                            </datalist>
                        </div>

                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="">Trademark</label>
                        <Textarea disabled={userAdress.length > 0} value={userAdress[0]?.trademark ?? description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </form>
                {
                    userAdress.length <= 0 && <Button onClick={() => {
                        if (rName != '' && country != '' && cityMunicipality != '' && description != '' && barangay != '' && province != '' && email != '' && phoneNumber != '') {
                            addCustomAddress([{

                                email: email,
                                rname: rName,
                                phone_number: phoneNumber.toString(),
                                country: country,
                                cityMunicipality: cityMunicipality,
                                barangay: barangay,
                                province: province,
                                trademark: description,

                            }])
                        } else {
                            alert('you need to fillup all the field')
                        }
                    }} variant={'secondary'}>Submit</Button>
                }

            </div>
            <div className='flex flex-col gap-5 p-10 w-full'>
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
                <Sheet>
                    <SheetTrigger asChild>
                        <button onClick={() => console.log('click')} className='flex p-2 rounded-[10px] items-center bg-white justify-between text-black/50'>
                            <div className='flex gap-1 items-center'>
                                <BiSolidDiscount className='text-black/50' />
                                <label className='cursor-pointer' htmlFor="">Vouchers</label>
                            </div>
                            <div className='flex gap-1 items-center'>
                                <label className={`${voucherAmount == 0 ? 'cursor-pointer text-black/50 ' : 'cursor-pointer text-green-400 border border-green-400 text-[12px] px-4'}`} htmlFor="">{voucherAmount == 0 ? 'Select Voucher' : 'Free Shipping Discount'}</label>
                                <MdOutlineChevronRight />
                            </div>

                        </button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Select Vouchers</SheetTitle>
                        </SheetHeader>
                        <div className='flex flex-col gap-2 items-center p-2'>
                            {vouchers.map((data, index) => (
                                <div key={index} className='rounded-[10px] w-full inset-shadow-sm inset-shadow-white/50 p-2'>
                                    <div className=' flex justify-between items-center'>
                                        <label className='' htmlFor="">{data.type}</label>
                                        <label className={`${data.is_used == false ? 'text-green-400' : 'text-red-400'}`} htmlFor="">{data.is_used == false ? 'Available' : 'Already used'}</label>
                                    </div>
                                    <div className='flex justify-between '>
                                        <div className='flex flex-col'>
                                            <label className='text-xl' htmlFor="">{data.code}</label>
                                            <label htmlFor="">{new Intl.NumberFormat('en-PH', {
                                                style: 'currency',
                                                currency: 'PHP',
                                            }).format(data.amount)}</label>
                                        </div>
                                        <SheetClose asChild>
                                            <Button onClick={() => {
                                                applyVoucher(data)
                                            }} variant={'secondary'} disabled={data.is_used == true}>Apply</Button>
                                        </SheetClose>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>


                {/* <div className='flex p-2 rounded-[10px] items-center bg-white justify-between '>
                    <div className='flex gap-1 items-center'>
                        <BiSolidDiscount className='text-black/50' />
                        <input type="text" placeholder='Enter discount code' className='outline-none text-black/80' value={inputVoucherCode} onChange={(e) => setInputVoucherCode(e.target.value)} />
                    </div>
                    <button onClick={applyVoucher} className='text-blue-400 underline'>Apply</button>
                </div> */}

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
                        <div className='flex items-center gap-2'>
                            {voucherAmount != 0 && <label className='line-through text-red-300' htmlFor="">{new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                            }).format(shippingCost)}</label>}
                            <label htmlFor="">{new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                            }).format(shippingCost - voucherAmount)}</label>
                        </div>

                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="" className='text-white/90 font-thin'>Discount</label>
                        <div className='flex items-center gap-2'>
                            {voucherAmount != 0 && <label className='text-red-300' htmlFor="">Voucher Selected</label>}
                            <label htmlFor="">{new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                            }).format(voucherAmount)}</label>
                        </div>

                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="">Total</label>
                        <label htmlFor="">{finalCheckoutItems.length > 0 ? new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(finalCheckoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + (shippingCost - voucherAmount)) : new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(0)}</label>
                    </div>

                </div>

                <div>
                    <Button onClick={() => {
                        finalCheckoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + shippingCost > 100000 ? alert('Order Price Maximum is 100000') :
                            CheckoutProduct()
                    }} variant={'secondary'} className=' p-2 flex gap-2 items-center justify-center w-full' disabled={loading === true || finalCheckoutItems.length <= 0 || paymentOptions == '' || userAdress.length == 0}> {loading && (
                        <ClipLoader

                            color='black'
                            size={20}
                        />
                    )}
                        {loading ? "Please Wait..." : "Place Order"}</Button>
                </div>


            </div>
        </div>
    )
}

export default Checkout
