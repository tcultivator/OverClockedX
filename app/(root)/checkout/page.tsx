"use client";
import React, { FormEvent, useEffect, useState } from 'react'
import { TbTruckDelivery } from "react-icons/tb";
import { PiPackageDuotone } from "react-icons/pi";
import { BiSolidDiscount } from "react-icons/bi";
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { RiDeleteBack2Fill } from 'react-icons/ri';
import { FaPlus, FaMinus } from "react-icons/fa6";
//import of dataset for address
import { luzonProvinces } from '@/utils/datasetAddress/province'
import { luzonPlaces } from '@/utils/datasetAddress/citiesAndMunicipality'
import { barangaysJaen } from '@/utils/datasetAddress/barangay'
import { useUserStore } from '@/stores/userStore';

import { useVoucherStore } from '@/stores/voucherStore';
import Image from 'next/image';
import { toast } from 'sonner'
import { voucherTypes } from '@/types/voucherTypes';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { RiErrorWarningFill } from "react-icons/ri";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";

import { LiaShippingFastSolid } from "react-icons/lia";

import { useLoading } from '@/stores/loadingStore';
type GcashCB = {
    referenceId: string;
    actions: {
        url: string
    }[];
}
import { MdOutlineChevronRight } from "react-icons/md";

import { Input } from "@/components/ui/input"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { Label } from '@/components/ui/label';
import { useAlertNotification } from '@/stores/alertNotificationStore';
const Checkout = () => {
    const finalCheckoutItems = useCartStore((state) => state.finalCheckoutItems)
    const [shippingOptions, setShippingOption] = useState('delivery');
    const [shippingCost, setShippingCost] = useState(200)

    const [CODorOTC, setCODorOTC] = useState('Cash On Delivery')
    const [paymentOptions, setPaymentOptions] = useState('');
    const user = useUserStore((state) => state.user)
    const router = useRouter();

    //zustand state for loading in button
    const buttonLoading = useLoading((state) => state.buttonLoading)
    const setButtonLoading = useLoading((state) => state.setButtonLoading)

    //zustand state for updating items from checkout
    const updateQuantityOfFinalCheckoutItem = useCartStore((state) => state.updateQuantityOfFinalCheckoutItem)
    const removeItemFromFinalCheckoutItems = useCartStore((state) => state.removeItemFromFinalCheckoutItems)

    // zustand function that add the custom shipping information to global state which needed for orders
    const addToUserAdress = useUserStore((state) => state.addToUserAdress)

    // this is the state that going to change if the user change shipping information
    const userAdress = useUserStore((state) => state.userAdress)


    // custom shipping information states
    const [address, setAddress] = useState({
        rName: '',
        cityMunicipality: '',
        address_line_1: '',
        barangay: '',
        province: '',
        email: '',
        phoneNumber: '',
        postal_code: ''

    })

    //zustand state for updating shipping information
    const CustomInput = useUserStore((state) => state.CustomInput)
    const addCustomAddress = useUserStore((state) => state.addCustomAddress)

    //zustand state for getting the voucher of that user
    const getAllVouchers = useVoucherStore((state) => state.getAllVouchers)
    const vouchers = useVoucherStore((state) => state.vouchers)
    const [voucherAmount, setVoucherAmount] = useState(0)

    // controller to display an error modal
    const setErrorMessageDisplay = useAlertNotification((state) => state.setErrorMessageDisplay)

    // this is the configuration for shipping options, if user select delivery, the shipping cost will increase while if pickup no shipping cost
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
    }, [getAllVouchers])



    //checkout the selected items,
    const CheckoutProduct = async () => {
        setButtonLoading(true)
        switch (paymentOptions) {
            case 'Gcash':
                const res = await fetch('/api/create-gcash-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: finalCheckoutItems.reduce((sum, item) => sum + (item.price - (item.value != null ? item.value : 0)) * item.quantity, 0) + shippingCost,
                        referenceId: 'txn-' + Date.now(),
                        phoneNumber: address.phoneNumber,
                        email: user?.email,
                    }),
                });
                const result = await res.json()
                const data = result as GcashCB

                // i should add validation to this, if gcash failed the order api should not run

                const insertOrders = await fetch('/api/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: user?.email,
                        referenceId: data.referenceId,
                        total_amount: finalCheckoutItems.reduce((sum, item) => sum + (item.price - (item.value != null ? item.value : 0)) * item.quantity, 0) + shippingCost,
                        checkoutItems: finalCheckoutItems,
                        payment_method: paymentOptions,
                        userAdress: userAdress
                    }),
                })
                const insertOrdersDone = await insertOrders.json()

                if (insertOrdersDone.status == 200) {
                    router.push(data.actions[0].url);

                }

                break;
            case 'Maya':
                setErrorMessageDisplay({
                    display: true,
                    title: 'Something went wrong!',
                    message: 'Maya as a payment method is not ready yet, please select other options'
                })

                break
            case 'Cash On Delivery':
                const codOrder = await fetch('/api/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: user?.email,
                        referenceId: 'txn-' + Date.now(),
                        total_amount: finalCheckoutItems.reduce((sum, item) => sum + (item.price - (item.value != null ? item.value : 0)) * item.quantity, 0) + shippingCost,
                        checkoutItems: finalCheckoutItems,
                        payment_method: paymentOptions,
                        userAdress: userAdress
                    }),
                })
                const codOrderDone = await codOrder.json()

                if (codOrderDone.status == 500) {
                    setErrorMessageDisplay({
                        display: true,
                        title: 'Something went wrong!',
                        message: 'Something went wrong from processing your order, please try again later'
                    })

                }
                router.push('/cod-success-page');

                break

            default:
                setErrorMessageDisplay({
                    display: true,
                    title: 'No Payment Option Selected!',
                    message: 'Please select payment options to continue'
                })
                break;
        }
        setButtonLoading(false)

    }
    //this apply voucher, this reduce the cost based on voucher type, if shipping voucher the shipping cost is reduce
    const applyVoucher = (voucher: voucherTypes) => {
        setVoucherAmount(voucher.amount)
        //added a toast that can undo the selected voucher
        toast.success("Shipping Voucher is added successfully", {
            description: `Ammount of ${voucher.amount} is deducted from shipping cost!`,
            action: {
                label: "Undo",
                onClick: () => setVoucherAmount(0),
            },
        })
    }



    // adding a new shipping information on incoming order, meaning if the user order, instead of using the default address it will input this new address in the orders
    const submitNewShippingInformation = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        addCustomAddress([{
            email: address.email,
            rname: address.rName,
            address_line_1: address.address_line_1,
            cityMunicipality: address.cityMunicipality,
            barangay: address.barangay,
            province: address.province,
            postal_code: Number(address.postal_code),
            phone_number: address.phoneNumber,
        }])

    }

    return (
        <div className='pb-2 text-white flex justify-center flex-col md:flex-row'>
            <div className='w-full bg-white border-r md:border-r-black/30 flex justify-end'>
                <div className=' text-black  flex flex-col  gap-5 p-3 w-full md:w-[90%] lg:w-[85%] xl:w-[80%] 2xl:w-[70%]  md:p-10'>
                    <h1>Checkout</h1>
                    <div className='flex gap-2 items center'>
                        <div className='flex items-center justify-center gap-2 bg-white  text-[13px]  p-2  rounded-[10px] border border-black/50 md:p-5 md:text-[15px]'>
                            <input
                                id='delivery'
                                type="radio"
                                value='delivery'
                                checked={shippingOptions == 'delivery'}
                                onChange={(e) => {

                                    setShippingOption(e.target.value)

                                }}
                                className='cursor-pointer' />
                            <TbTruckDelivery />
                            <label htmlFor="delivery" className='cursor-pointer'>Delivery</label>
                        </div>
                        <div className='flex items-center justify-center gap-2 bg-white text-[13px] p-2 rounded-[10px] border border-black/50 md:p-5 md:text-[15px]'>
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
                        <div className='flex gap-2 items-center'>
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
                            {/* icon for payment optinon field*/}
                            {paymentOptions != '' ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                        </div>

                    </div>

                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="item-1"
                    >
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Shipping Information</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <div className='flex items-center justify-between'>
                                    <h1>Update Shipping Information</h1>
                                    <button onClick={() => {
                                        if (userAdress.length > 0) {
                                            CustomInput();
                                        } else {
                                            addToUserAdress();
                                        }
                                    }} className='underline text-[12px] text-blue-400'>{userAdress.length > 0 ? 'Edit Address' : 'Use Current Address'}</button>
                                </div>


                                <form onSubmit={submitNewShippingInformation} className='flex flex-col gap-1 md:flex  '>

                                    <div className='flex flex-col'>
                                        <label htmlFor="">Fullname</label>
                                        <div className='w-full flex gap-2 items-center'>
                                            <Input disabled={userAdress.length > 0}
                                                placeholder='Recipient Full Name'
                                                type="text"
                                                required
                                                value={userAdress[0]?.rname ?? address.rName}
                                                onChange={(e) => setAddress(prev => ({ ...prev, rName: e.target.value }))} />
                                            {/* icon for input field, guide to user if the field is already fill */}
                                            {address.rName != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>
                                        <label htmlFor="">Email Address</label>
                                        <div className='w-full flex gap-2 items-center'>
                                            <Input disabled={userAdress.length > 0}
                                                placeholder='Recipient Email'
                                                type="email"
                                                required
                                                value={userAdress[0]?.email ?? address.email}
                                                onChange={(e) => setAddress(prev => ({ ...prev, email: e.target.value }))} />
                                            {/* icon for input field, guide to user if the field is already fill */}
                                            {address.email != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                        </div>

                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="">Phone Number</label>
                                        <div className='w-full flex gap-2 items-center'>
                                            <Input disabled={userAdress.length > 0}
                                                placeholder='09xxxxxxxxx'
                                                type="number"
                                                required
                                                value={userAdress[0]?.phone_number ?? address.phoneNumber}
                                                onChange={(e) => setAddress(prev => ({ ...prev, phoneNumber: e.target.value }))} />
                                            {/* icon for input field, guide to user if the field is already fill */}
                                            {address.phoneNumber != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                        </div>

                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="">Province</label>
                                        <div className='w-full flex gap-2 items-center'>
                                            <Input disabled={userAdress.length > 0}
                                                placeholder='eg:Nueva Ecija'
                                                list='province'
                                                name='province'
                                                required
                                                value={userAdress[0]?.province ?? address.province}
                                                onChange={(e) => setAddress(prev => ({ ...prev, province: e.target.value }))} />
                                            {/* icon for input field, guide to user if the field is already fill */}
                                            {address.province != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                            <datalist id='province'>
                                                {luzonProvinces.map((data, index) => (
                                                    <option key={index} value={data}>{data}</option>
                                                ))}
                                            </datalist>
                                        </div>

                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor="">Address line 1</label>
                                        <div className='w-full flex gap-2 items-center'>
                                            <Input disabled={userAdress.length > 0}
                                                placeholder="House No. / Street / Building"
                                                value={userAdress[0]?.address_line_1 ?? address.address_line_1}
                                                required
                                                onChange={(e) => setAddress(prev => ({ ...prev, address_line_1: e.target.value }))} />
                                            {/* icon for input field, guide to user if the field is already fill */}
                                            {address.address_line_1 != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}

                                        </div>

                                    </div>
                                    <div className='flex gap-1'>

                                        <div className='flex flex-col w-full'>
                                            <label htmlFor="">City/Municipality</label>
                                            <div className='w-full flex gap-2 items-center'>
                                                <Input disabled={userAdress.length > 0}
                                                    placeholder='eg:Jaen'
                                                    list='city'
                                                    name='city'
                                                    required
                                                    value={userAdress[0]?.cityMunicipality ?? address.cityMunicipality}
                                                    onChange={(e) => setAddress(prev => ({ ...prev, cityMunicipality: e.target.value }))} />
                                                {/* icon for input field, guide to user if the field is already fill */}
                                                {address.cityMunicipality != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                                <datalist id='city'>
                                                    {luzonPlaces.map((data, index) => (
                                                        <option key={index} value={data}>{data}</option>
                                                    ))}
                                                </datalist>
                                            </div>

                                        </div>

                                        <div className='flex flex-col w-full'>
                                            <label htmlFor="">Barangay</label>
                                            <div className='w-full flex gap-2 items-center'>
                                                <Input disabled={userAdress.length > 0}
                                                    placeholder='eg:Sapang'
                                                    list='barangay'
                                                    name='barangay'
                                                    required
                                                    value={userAdress[0]?.barangay ?? address.barangay}
                                                    onChange={(e) => setAddress(prev => ({ ...prev, barangay: e.target.value }))} />
                                                {/* icon for input field, guide to user if the field is already fill */}
                                                {address.barangay != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                                <datalist id='barangay'>
                                                    {barangaysJaen.map((data, index) => (
                                                        <option key={index} value={data}>{data}</option>
                                                    ))}
                                                </datalist>
                                            </div>

                                        </div>

                                        <div className='flex flex-col w-full'>
                                            <label htmlFor="">Postal Code</label>
                                            <div className='w-full flex gap-2 items-center'>
                                                <Input disabled={userAdress.length > 0}
                                                    type='number'
                                                    placeholder='eg:3109'
                                                    required
                                                    value={userAdress[0]?.postal_code ?? address.postal_code}
                                                    onChange={(e) => setAddress(prev => ({ ...prev, postal_code: e.target.value }))} />
                                                {/* icon for input field, guide to user if the field is already fill */}
                                                {address.postal_code != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}

                                            </div>

                                        </div>

                                    </div>


                                    {
                                        userAdress.length <= 0 && <Button type='submit' variant={'default'} className='w-full'>Submit</Button>
                                    }
                                </form>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            <div className='w-full bg-white'>
                <div className='flex flex-col gap-5 text-black p-3 w-full md:w-[90%] lg:w-[85%] xl:w-[80%] 2xl:w-[70%] md:p-10'>
                    <h1>Review your cart</h1>

                    <div className='flex flex-col gap-2'>
                        {finalCheckoutItems.map((data, index) => (
                            <div key={index} className='flex justify-between gap-5 p-5 items-center 0 bg-[#F1F0EE] rounded relative'>
                                <div className='flex gap-3 items-center'>
                                    <Image src={data.product_image} alt="" className='w-20 border bg-white border-black/20' width={100} height={100} />
                                    <div className='flex flex-col justify-start'>
                                        <label htmlFor="">{data.product_name}</label>
                                        <div className='flex flex-col-reverse justify-start sm:flex-row items-start sm:items-center gap-1'>

                                            {data.value != null && <Label className='text-start'>{new Intl.NumberFormat('en-PH', {
                                                style: 'currency',
                                                currency: 'PHP',
                                            }).format(data.price - Number(data.value))}</Label>}
                                            <Label htmlFor="" className={`${data.value != null && 'line-through text-start text-black/30 text-[12px]'}`}>{new Intl.NumberFormat('en-PH', {
                                                style: 'currency',
                                                currency: 'PHP',
                                            }).format(data.price)}</Label>
                                        </div>

                                    </div>
                                </div>
                                <div className="flex gap-2 border border-black/20 w-max p-1 px-2 rounded text-[10px]">
                                    <button onClick={() => {
                                        if (data.quantity > 1) {
                                            updateQuantityOfFinalCheckoutItem(false, data.product_id)
                                        }
                                    }} className="text-black" ><FaMinus /></button>
                                    <input disabled type="number" className=" text-black px-1 w-[20px] bg-white/30 text-center outline-none rounded p-1" value={data.quantity} />
                                    <button onClick={() => {
                                        if (data.stocks > data.quantity) {
                                            updateQuantityOfFinalCheckoutItem(true, data.product_id)
                                        }
                                    }} className="text-black"><FaPlus /></button>

                                </div>
                                <button disabled={finalCheckoutItems.length <= 0} onClick={() => removeItemFromFinalCheckoutItems(data.product_id)} className='absolute top-0 right-0 text-[25px] text-red-400'><RiDeleteBack2Fill /></button>

                            </div>
                        ))}


                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <button onClick={() => console.log('click')} className='flex p-2 rounded-[10px] items-center bg-[#F1F0EE] justify-between text-black/50'>
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
                                <div className='flex items-center justify-between'>
                                    <SheetTitle>Select Vouchers</SheetTitle>
                                    <SheetClose asChild>
                                        <LiaTimesSolid className='cursor-pointer' />

                                    </SheetClose>
                                </div>

                            </SheetHeader>
                            <div className='flex flex-col gap-2 items-center p-2'>
                                {vouchers.map((data, index) => (
                                    <div
                                        key={index}
                                        className={`${data.is_used ? 'opacity-40' : 'opacity-100'
                                            } w-full rounded-xl border border-dashed border-black bg-gradient-to-r from-black/10 to-black/20 p-4 flex flex-col gap-3`}
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-black flex items-center gap-1">
                                                <LiaShippingFastSolid /> Shipping Voucher
                                            </span>

                                            {data.is_used ? (
                                                <span className="text-xs bg-gray-300 text-gray-600 px-2 py-1 rounded-full">
                                                    USED
                                                </span>
                                            ) :
                                                <></>}
                                        </div>

                                        {/* Amount */}
                                        <div className="flex items-end gap-1">
                                            <span className="text-3xl font-anton text-black">
                                                {new Intl.NumberFormat('en-PH', {
                                                    style: 'currency',
                                                    currency: 'PHP',
                                                }).format(data.amount)}
                                            </span>
                                            <span className="text-sm text-black mb-1">OFF SHIPPING</span>
                                        </div>

                                        {/* Info */}
                                        <p className="text-xs text-black">
                                            Valid for shipping fees only
                                        </p>

                                        {/* Action */}
                                        <button
                                            onClick={() => applyVoucher(data)}
                                            disabled={data.is_used}
                                            className={`mt-2 w-full rounded-lg py-2 text-sm font-semibold transition
      ${data.is_used
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-black text-white hover:bg-black/80'
                                                }
    `}
                                        >
                                            Apply Shipping Voucher
                                        </button>
                                    </div>

                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className='flex flex-col gap-1'>
                        <div className='flex justify-between items-center'>
                            <Label htmlFor="" className='text-black/90 font-light'>Subtotal</Label>
                            <Label className='font-light' htmlFor="">{finalCheckoutItems.length > 0 ? new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                            }).format(finalCheckoutItems.reduce((sum, item) => sum + (item.price - (item.value != null ? item.value : 0)) * item.quantity, 0)) : new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                            }).format(0)}</Label>
                        </div>
                        <div className='flex justify-between items-center'>
                            <Label htmlFor="" className='text-black/90 font-light'>Shipping</Label>
                            <div className='flex items-center gap-2'>
                                {voucherAmount != 0 && <Label className='line-through text-red-300 font-light text-[12px]' htmlFor="">{new Intl.NumberFormat('en-PH', {
                                    style: 'currency',
                                    currency: 'PHP',
                                }).format(shippingCost)}</Label>}
                                <Label className='font-light' htmlFor="">{new Intl.NumberFormat('en-PH', {
                                    style: 'currency',
                                    currency: 'PHP',
                                }).format(shippingCost - voucherAmount)}</Label>
                            </div>

                        </div>
                        <div className='flex justify-between items-center'>
                            <Label htmlFor="" className='text-black/90 font-light'>Discount</Label>
                            <div className='flex items-center gap-2'>
                                {voucherAmount != 0 && <Label className='text-white font-light text-[12px] bg-red-500 px-1' htmlFor="">Voucher Selected</Label>}
                                <Label className='font-light' htmlFor="">{new Intl.NumberFormat('en-PH', {
                                    style: 'currency',
                                    currency: 'PHP',
                                }).format(voucherAmount)}</Label>
                            </div>

                        </div>
                        <div className='flex justify-between items-center'>
                            <Label htmlFor="">Total</Label>
                            <Label htmlFor="">{finalCheckoutItems.length > 0 ? new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                            }).format(finalCheckoutItems.reduce((sum, item) => sum + (item.price - (item.value != null ? item.value : 0)) * item.quantity, 0) + (shippingCost - voucherAmount)) : new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                            }).format(0)}</Label>
                        </div>

                    </div>

                    <div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant={'default'} className=' p-2 flex gap-2 items-center justify-center w-full' disabled={buttonLoading === true || finalCheckoutItems.length <= 0 || paymentOptions == '' || userAdress.length == 0}> {buttonLoading && (
                                    <ClipLoader
                                        color='white'
                                        size={20}
                                    />
                                )}
                                    {buttonLoading ? "Please Wait..." : "Place Order"}</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Ready to Place Your Order?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        By confirming, your order will be submitted for processing.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                        const totalPrice = finalCheckoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + shippingCost;
                                        if (totalPrice >= 100000) {
                                            setErrorMessageDisplay({
                                                display: true,
                                                title: 'Maximum Ammount!',
                                                message: 'Please limit your order ammount to less that 100k!'
                                            })
                                            
                                        } else if (user == null) {
                                            setErrorMessageDisplay({
                                                display: true,
                                                title: 'Unauthorize',
                                                message: 'Please signin first before placing an order!'
                                            })
                                        } else {
                                           CheckoutProduct();
                                        }
                                    }}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>


                </div>
            </div>

        </div>
    )
}

export default Checkout
