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
import { countries } from '@/utils/datasetAddress/country'
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

import { useLoading } from '@/stores/loadingStore';
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

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { Label } from '@/components/ui/label';
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

    const addToUserAdress = useUserStore((state) => state.addToUserAdress)
    const userAdress = useUserStore((state) => state.userAdress)


    //make this as single state
    const [rName, setRName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [cityMunicipality, setCityMunicipality] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [barangay, setBarangay] = useState<string>('');
    const [province, setProvince] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string | number>('');

    //zustand state for updating shipping information
    const CustomInput = useUserStore((state) => state.CustomInput)
    const addCustomAddress = useUserStore((state) => state.addCustomAddress)

    //zustand state for getting the voucher of that user
    const getAllVouchers = useVoucherStore((state) => state.getAllVouchers)
    const vouchers = useVoucherStore((state) => state.vouchers)
    const [voucherAmount, setVoucherAmount] = useState(0)

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
                        phoneNumber: '09171234567',
                        email: user?.email,
                    }),
                });
                const result = await res.json()
                const data = result as GcashCB
                
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
                        payment_method: paymentOptions
                    }),
                })
                const insertOrdersDone = await insertOrders.json()
                console.log("eto laman ng inser orderr ", insertOrdersDone)
                if (insertOrdersDone.status == 200) {
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
        setButtonLoading(false)

    }
    //this apply voucher, this reduce the cost based on voucher type, if shipping voucher the shipping cost is reduce
    const applyVoucher = (voucher: voucherTypes) => {
        setVoucherAmount(voucher.amount)
        //added a toast that can undo the selected voucher
        toast("Event has been created", {
            description: "Discount Voucher is added successfully",
            action: {
                label: "Undo",
                onClick: () => setVoucherAmount(0),
            },
        })
    }
    return (
        <div className='px-2 pb-2 text-white flex flex-col md:gap-2 md:flex-row'>
            <div className='bg-black  flex flex-col rounded-t-[10px] gap-5 p-3 w-full md:inset-shadow-sm inset-shadow-white/50 md:p-10 md:rounded-[10px]'>
                <h1>Checkout</h1>
                <div className='flex gap-2 items center'>
                    <div className='flex items-center justify-center gap-2 bg-[#1E1E1E] text-[13px]  p-2  rounded-[10px] border border-white/50 md:p-5 md:text-[15px]'>
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
                    <div className='flex items-center justify-center gap-2 bg-[#1E1E1E] text-[13px] p-2 rounded-[10px] border border-white/50 md:p-5 md:text-[15px]'>
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


                            <form className='flex flex-col gap-1 md:flex  '>

                                <div className='flex flex-col'>
                                    <label htmlFor="">Fullname</label>
                                    <div className='w-full flex gap-2 items-center'>
                                        <Input required disabled={userAdress.length > 0} type="text" value={userAdress[0]?.rname ?? rName} onChange={(e) => setRName(e.target.value)} />
                                        {rName != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                    </div>
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="">Email Address</label>
                                    <div className='w-full flex gap-2 items-center'>
                                        <Input disabled={userAdress.length > 0} type="email" value={userAdress[0]?.email ?? email} onChange={(e) => setEmail(e.target.value)} />
                                        {email != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                    </div>

                                </div>
                                <div className='flex flex-col'>
                                    <label htmlFor="">Country</label>
                                    <div className='w-full flex gap-2 items-center'>
                                        <Input disabled={userAdress.length > 0} list="countries" name="countries" value={userAdress[0]?.country ?? country} onChange={(e) => setCountry(e.target.value)} />
                                        {country != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                        <datalist id='countries' className='absolute bg-white text-black'>
                                            {countries.map((data, index) => (
                                                <option key={index} value={data}>{data}</option>
                                            ))}
                                        </datalist>
                                    </div>

                                </div>
                                <div className='flex gap-1'>

                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="">City/Municipality</label>
                                        <div className='w-full flex gap-2 items-center'>
                                            <Input disabled={userAdress.length > 0} list='city' name='city' value={userAdress[0]?.cityMunicipality ?? cityMunicipality} onChange={(e) => setCityMunicipality(e.target.value)} />
                                            {cityMunicipality != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
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
                                            <Input disabled={userAdress.length > 0} list='barangay' name='barangay' value={userAdress[0]?.barangay ?? barangay} onChange={(e) => setBarangay(e.target.value)} />
                                            {barangay != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                            <datalist id='barangay'>
                                                {barangaysJaen.map((data, index) => (
                                                    <option key={index} value={data}>{data}</option>
                                                ))}
                                            </datalist>
                                        </div>

                                    </div>

                                    <div className='flex flex-col w-full'>
                                        <label htmlFor="">Province</label>
                                        <div className='w-full flex gap-2 items-center'>
                                            <Input disabled={userAdress.length > 0} list='province' name='province' value={userAdress[0]?.province ?? province} onChange={(e) => setProvince(e.target.value)} />
                                            {province != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                            <datalist id='province'>
                                                {luzonProvinces.map((data, index) => (
                                                    <option key={index} value={data}>{data}</option>
                                                ))}
                                            </datalist>
                                        </div>

                                    </div>

                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="">Trademark</label>
                                    <div className='w-full flex gap-2 items-center'>
                                        <Textarea disabled={userAdress.length > 0} value={userAdress[0]?.trademark ?? description} onChange={(e) => setDescription(e.target.value)} />
                                        {description != '' || userAdress.length > 0 ? <IoIosCheckmarkCircle className='text-green-400' /> : <RiErrorWarningFill className='text-yellow-400' />}
                                    </div>
                                </div>
                                {
                                    userAdress.length <= 0 && <Button onClick={() => {
                                        if (rName != '' && country != '' && cityMunicipality != '' && description != '' && barangay != '' && province != '' && email != '' && phoneNumber != '') {
                                            addCustomAddress([{

                                                email: email,
                                                rname: rName,
                                                country: country,
                                                cityMunicipality: cityMunicipality,
                                                barangay: barangay,
                                                province: province,
                                                trademark: description,

                                            }])
                                        } else {
                                            alert('you need to fillup all the field')
                                        }
                                    }} variant={'secondary'} className='w-full'>Submit</Button>
                                }
                            </form>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div className='flex flex-col gap-5 bg-black p-3 w-full md:bg-black/0 md:p-10'>
                <h1>Review your cart</h1>

                <div className='flex flex-col gap-2'>
                    {finalCheckoutItems.map((data, index) => (
                        <div key={index} className='flex justify-between gap-5 p-5 items-center bg-black rounded relative'>
                            <div className='flex gap-3 items-center'>
                                <Image src={data.product_image} alt="" className='w-20 border border-white/50' width={100} height={100} />
                                <div className='flex flex-col'>
                                    <label htmlFor="">{data.product_name}</label>
                                    <div className='flex items-center gap-2'>
                                        <label htmlFor="" className={`${data.value != null && 'line-through text-white/30'}`}>{data.price}</label>
                                        {data.value != null && <Label>{new Intl.NumberFormat('en-PH', {
                                            style: 'currency',
                                            currency: 'PHP',
                                        }).format(data.price - Number(data.value))}</Label>}
                                    </div>

                                </div>
                            </div>
                            <div className="flex gap-2 bg-black w-max p-1 px-2 rounded text-[10px]">
                                <button onClick={() => {
                                    if (data.quantity > 1) {
                                        updateQuantityOfFinalCheckoutItem(false, data.product_id)
                                    }
                                }} className="text-white" ><FaMinus /></button>
                                <input disabled type="number" className=" text-white px-1 w-[20px] bg-white/30 text-center outline-none rounded p-1" value={data.quantity} />
                                <button onClick={() => {
                                    if (data.stocks > data.quantity) {
                                        updateQuantityOfFinalCheckoutItem(true, data.product_id)
                                    }
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
                                <div key={index} className={`${data.is_used == true ? 'opacity-25' : 'opacity-100'} rounded flex justify-between w-full bg-[#1C6CFF]`}>
                                    <div className=' flex flex-col items-center p-2'>
                                        <label className='' htmlFor="">{data.type}</label>
                                        <label htmlFor="" className='font-anton text-[25px]'>{new Intl.NumberFormat('en-PH', {
                                            style: 'currency',
                                            currency: 'PHP',
                                        }).format(data.amount)}</label>
                                    </div>
                                    <div className='w-max bg-red-400 h-full relative border-l border-white/40 flex items-center justify-center'>
                                        <div className='w-[20px] bg-black absolute rounded-[50%] h-[20px] top-[-6px] left-[-10px]'></div>
                                        <div className='w-[20px] bg-black absolute rounded-[50%] h-[20px] bottom-[-6px] left-[-10px]'></div>
                                        <SheetClose asChild>
                                            <button className='rotate-90 w-full  text-center items-center justify-center flex' onClick={() => {
                                                applyVoucher(data)
                                            }} disabled={data.is_used == true}>USE</button>
                                        </SheetClose>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>

                <div className=''>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="" className='text-white/90 font-thin'>Subtotal</label>
                        <label htmlFor="">{finalCheckoutItems.length > 0 ? new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(finalCheckoutItems.reduce((sum, item) => sum + (item.price - (item.value != null ? item.value : 0)) * item.quantity, 0)) : new Intl.NumberFormat('en-PH', {
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
                        }).format(finalCheckoutItems.reduce((sum, item) => sum + (item.price - (item.value != null ? item.value : 0)) * item.quantity, 0) + (shippingCost - voucherAmount)) : new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                        }).format(0)}</label>
                    </div>

                </div>

                <div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant={'secondary'} className=' p-2 flex gap-2 items-center justify-center w-full' disabled={buttonLoading === true || finalCheckoutItems.length <= 0 || paymentOptions == '' || userAdress.length == 0}> {buttonLoading && (
                                <ClipLoader
                                    color='black'
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
                                    if (totalPrice < 100000 && user != null) {
                                        CheckoutProduct();
                                    } else {
                                        alert('Order Price Maximum is 100000');
                                    }
                                }}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>


            </div>
        </div>
    )
}

export default Checkout
