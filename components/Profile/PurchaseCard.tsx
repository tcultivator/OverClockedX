"use client"
import React from 'react'
import Image from 'next/image';
import { GroupedOrder } from '@/types/GroupOrder';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from '../ui/button';
import { ClipLoader } from 'react-spinners';
import { orderStatusUI } from '@/utils/orderStatusUI/orderStatusUI';

import { LuSquareArrowOutUpRight } from "react-icons/lu";

type Props = {
    groupData: GroupedOrder[]
}
import { useState, useEffect } from 'react';
import { usePurchaseStore } from '@/stores/purchaseStore';
import { useLoading } from '@/stores/loadingStore';
const PurchaseCard = ({ groupData }: Props) => {
    const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

    const [openDialog, setOpenDialog] = useState(false)

    const purchaseData = usePurchaseStore((state) => state.purchaseData)
    const selectedGroup = usePurchaseStore((state) => state.selectedGroup)
    const setSelectedGroup = usePurchaseStore((state) => state.setSelectedGroup)
    const setPurchaseData = usePurchaseStore((state) => state.setPurchaseData)
    const cancelOrder = usePurchaseStore((state) => state.cancelOrder)
    const buttonLoading = useLoading((state) => state.buttonLoading)
    useEffect(() => {
        setPurchaseData(groupData)
    }, [])
    const toggleExpand = (index: number) => {
        setExpandedGroups(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const [filterOrderStatus, setFilterOrderStatus] = useState('all')

    const orderStatusFilter = ['all', 'pending', 'preparing', 'On Delivery', 'success', 'cancel']



    return (
        <div className='w-full sm:w-[85%] lg:w-[95%] xl:w-[80%] 2xl:w-[70%] mx-auto flex flex-col gap-2'>
            <div className=' '>
                <Label className='text-[15px] md:text-[20px] font-orbitron font-normal'>My Orders</Label>
            </div>

            <div className='py-2 px-[2px] w-full flex items-center gap-1 md:gap-2 overflow-x-auto flex-nowrap no-scrollbar'>
                {orderStatusFilter.map((data, index) => (
                    <button key={index} onClick={() => setFilterOrderStatus(data)} className={`cursor-pointer flex justify-center items-center py-1 px-3 rounded min-w-[100px] border ${filterOrderStatus === data ? 'text-white bg-black' : 'text-black bg-white border-black/30'}`}>
                        <Label className='text-[12px] capitalize'>{data}</Label>
                    </button>
                ))}

            </div>
            <div className='flex flex-col'>
                {/* desktop view header */}
                <div className='hidden md:flex w-full items-center p-2 border-b border-black/20 rounded-t bg-white'>
                    <div className='w-[7%]'>
                        <Label className='text-[10px] lg:text-[12px] capitalize'>Order Id</Label>
                    </div>
                    <div className='w-[25%]'>
                        <Label className='text-[10px] lg:text-[12px] capitalize'>Products</Label>
                    </div>
                    <div className='w-[12%]'>
                        <Label className='text-[10px] lg:text-[12px] capitalize'>Price</Label>
                    </div>
                    <div className='w-[6%]'>
                        <Label className='text-[10px] lg:text-[12px] capitalize'>Quantity</Label>
                    </div>
                    <div className='w-[15%]'>
                        <Label className='text-[10px] lg:text-[12px] capitalize'>Reference Id</Label>
                    </div>
                    <div className='w-[12%]'>
                        <Label className='text-[10px] lg:text-[12px] capitalize'>Sub Total</Label>
                    </div>
                    <div className='w-[10%]'>
                        <Label className='text-[10px] lg:text-[12px] capitalize'>Status</Label>
                    </div>
                    <div className='w-[13%]'>
                        <Label className='text-[10px] lg:text-[12px] capitalize'>Order Date</Label>
                    </div>
                </div>

                {
                    purchaseData.filter(item => filterOrderStatus === 'all' ? item.order_status != '' : item.order_status == filterOrderStatus).length > 0 ?

                        <div className='flex flex-col gap-2  lg:max-h-[75vh] overflow-auto'>
                            {purchaseData.filter(item => filterOrderStatus === 'all' ? item.order_status != '' : item.order_status == filterOrderStatus).map((group, groupIndex) => {
                                const isExpanded = expandedGroups[groupIndex] || false;

                                return (
                                    <div
                                        className='flex flex-col gap-2  '
                                        key={groupIndex}>
                                        <div className='hidden md:block bg-white border-b border-black/20 p-2 rounded'>
                                            <div style={{
                                                maxHeight: isExpanded ? `${group.items.length * 70}px` : '60px',
                                                overflow: 'hidden',
                                                transition: 'max-height 0.6s ease',
                                            }}
                                                onClick={() => {
                                                    setSelectedGroup(group)
                                                    setOpenDialog(true)
                                                }}
                                            >
                                                {group.items.map((item, itemIndex) => (
                                                    <div key={itemIndex} className='w-full flex items-center' >
                                                        <div className='w-[7%]'>
                                                            <Label className='text-[11px] lg:text-[13px]'>{group.order_id}</Label>
                                                        </div>
                                                        <div className='w-[25%] flex items-center gap-1'>
                                                            <div>
                                                                <Image
                                                                    src={item.product_image}
                                                                    alt=""
                                                                    className='w-15 aspect-square bg-white'
                                                                    width={100}
                                                                    height={100}
                                                                />
                                                            </div>
                                                            <Label className='text-[11px] lg:text-[13px]'>{item.product_name}</Label>
                                                        </div>
                                                        <div className='w-[12%]'>
                                                            <Label className='text-[11px] lg:text-[13px]'>{new Intl.NumberFormat('en-PH', {
                                                                style: 'currency',
                                                                currency: 'PHP',
                                                            }).format(item.price)}</Label>
                                                        </div>
                                                        <div className='w-[6%]'>
                                                            <Label className='text-[11px] lg:text-[13px]'>{item.quantity}</Label>
                                                        </div>
                                                        <div className='w-[15%]'>
                                                            <Label className='text-[11px] lg:text-[13px]'>{group.reference_id}</Label>
                                                        </div>
                                                        <div className='w-[12%]'>
                                                            <Label className='text-[11px] lg:text-[13px]'>{new Intl.NumberFormat('en-PH', {
                                                                style: 'currency',
                                                                currency: 'PHP',
                                                            }).format(item.sub_total)}</Label>
                                                        </div>
                                                        <div className='w-[10%]'>
                                                            <Label className={`${orderStatusUI[group.order_status]} text-[11px] lg:text-[13px] capitalize`}>{group.order_status}</Label>
                                                        </div>
                                                        <div className='w-[13%]'>
                                                            <Label className='text-[11px] lg:text-[13px]'>{new Date(group.created_at).toLocaleString("en-US", { month: "long", day: 'numeric', year: "numeric" })}</Label>
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>

                                            {/* show more button */}
                                            <div className={`flex ${group.items.length > 1 ? 'justify-between' : 'justify-end'}  items-center`}>
                                                {group.items.length > 1 && (
                                                    <button
                                                        onClick={() => toggleExpand(groupIndex)}
                                                        className='text-blue-400 text-[12px]'
                                                    >
                                                        {isExpanded ? 'Show Less' : 'Show More'}
                                                    </button>
                                                )}

                                            </div>
                                        </div>
                                        <div className='rounded flex flex-col gap-2 bg-white p-3 border border-black/10 md:hidden'>
                                            <div style={{
                                                maxHeight: isExpanded ? `${group.items.length * 195}px` : '185px',
                                                overflow: 'hidden',
                                                transition: 'max-height 0.6s ease',
                                            }}
                                                className='flex flex-col gap-2'>
                                                <div className='flex justify-between items-center'>
                                                    <Label className='text-[10px] font-normal'>{new Date(group.created_at).toLocaleString("en-US", { month: "long", day: 'numeric', year: "numeric" })}</Label>
                                                    <button onClick={() => {
                                                        setSelectedGroup(group)
                                                        setOpenDialog(true)
                                                    }} className=' text-black text-[18px]'><LuSquareArrowOutUpRight /></button>
                                                </div>
                                                {group.items.map((item, itemIndex) => (
                                                    <div key={itemIndex} className='flex flex-col gap-1'>

                                                        <div className='flex items-center gap-1'>
                                                            <div >
                                                                <Image
                                                                    src={item.product_image}
                                                                    alt=""
                                                                    className='w-22 aspect-square bg-white rounded-[15px] border border-black/15'
                                                                    width={100}
                                                                    height={100}
                                                                />
                                                            </div>
                                                            <div className='flex flex-col justify-start '>
                                                                <Label className='text-[12px] font-normal'>{item.product_name}</Label>
                                                                <Label className='text-[12px] font-normal'>{new Intl.NumberFormat('en-PH', {
                                                                    style: 'currency',
                                                                    currency: 'PHP',
                                                                }).format(item.price)}</Label>
                                                            </div>
                                                        </div>
                                                        <div className='flex flex-col gap-1'>
                                                            <div className='flex items-center justify-between'>
                                                                <Label className='text-[12px] text-black/60'>Order Id</Label>
                                                                <Label className='text-[12px] text-black/80'>{group.order_id}</Label>
                                                            </div>
                                                            <div className='flex items-center justify-between'>
                                                                <Label className='text-[12px] text-black/60'>Quantity</Label>
                                                                <Label className='text-[12px] text-black/80'>{item.quantity}</Label>
                                                            </div>
                                                            <div className='flex items-center justify-between'>
                                                                <Label className='text-[12px] text-black/60'>Status</Label>
                                                                <Label className={`${orderStatusUI[group.order_status]} text-[12px] capitalize`}>{group.order_status}</Label>
                                                            </div>

                                                        </div>

                                                    </div>
                                                ))}

                                            </div>
                                            {/* show more button */}
                                            <div className={`flex ${group.items.length > 1 ? 'justify-between' : 'justify-end'}  items-center`}>
                                                {group.items.length > 1 && (
                                                    <button
                                                        onClick={() => toggleExpand(groupIndex)}
                                                        className='text-blue-400 text-[12px]'
                                                    >
                                                        {isExpanded ? 'Show Less' : 'Show More'}
                                                    </button>
                                                )}


                                            </div>



                                        </div>

                                    </div>
                                );
                            })}
                        </div> :
                        <div className='bg-white border border-black/10 p-5 rounded mt-2 flex flex-col gap-1 items-center justify-center'>
                            <Image src="/eyes.png" alt='' width={400} height={400} className='w-[70px]' />
                            <div className='flex items-center gap-1 flex-col text-center justify-center'>
                                <Label className='text-black font-orbitron'>No Orders Found</Label>
                                <Label className='text-black/50'>It looks like you haven&apos;t made any orders yet</Label>
                            </div>
                        </div>


                }


            </div>


            {/* Alert Dialog */}
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent className="bg-white text-black border border-gray-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purchase Details</AlertDialogTitle>

                        {selectedGroup ? (
                            <>
                                <div className='flex flex-col'>
                                    <Label className='text-black/60 text-sm'>Order Id:{selectedGroup.order_id}</Label>
                                    <Label className='text-black/60 text-sm'>{new Date(selectedGroup.created_at).toLocaleString("en-US", { month: "long", day: 'numeric', year: "numeric" })}</Label>
                                </div>
                                <div className='flex gap-2 text-black'>
                                    <div className=' flex flex-col gap-2 w-full'>
                                        <div className='p-3 border rounded-[10px] border-black/15 flex flex-col gap-2'>
                                            <div className='flex items-center gap-3'>
                                                <Label>Purchase Item</Label>
                                                <Label className='font-normal flex items-center justify-center p-1 rounded bg-red-400/30 text-red-400 w-max px-2'>Order {selectedGroup.order_status}</Label>
                                            </div>
                                            <Label className="text-sm text-black/40">These are the products in the order.</Label>

                                            <ScrollArea className='flex flex-col gap-1 max-h-[150px] md:max-h-[200px]'>
                                                {
                                                    selectedGroup.items.map((data, index) => (
                                                        <div key={index} className='flex gap-1 items-center border-b border-white/15'>
                                                            <Image src={data.product_image} alt='' width={100} height={100} className='w-20 rounded' />
                                                            <div className='flex flex-col gap-1 justify-start'>
                                                                <Label className='text-[12px] md:text-[14px] text-start'>{data.product_name}</Label>
                                                                <Label>{new Intl.NumberFormat('en-PH', {
                                                                    style: 'currency',
                                                                    currency: 'PHP',
                                                                }).format(data.price)}</Label>
                                                                <Label className='text-[11px]'>x{data.quantity}</Label>
                                                            </div>

                                                        </div>

                                                    ))
                                                }



                                            </ScrollArea >
                                        </div>
                                        <div className='p-3 border rounded-[10px] border-black/15 flex flex-col gap-2'>
                                            <div className='flex items-center gap-3'>
                                                <Label>Order Summary</Label>
                                                <Label className='font-normal flex items-center justify-center p-1 rounded bg-green-400/30 text-green-400 w-max'>Payment {selectedGroup.payment_status}</Label>
                                            </div>
                                            <Label className="text-[12px] md:text-sm text-start text-black/40">A summary of the customers order details.</Label>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex items-center justify-between'>
                                                    <Label className='font-thin'>Payment</Label>
                                                    <Label className='font-thin'>{selectedGroup.payment_method}</Label>
                                                </div>
                                                <div className='flex items-center justify-between '>
                                                    <Label className='font-thin'>Subtotal</Label>
                                                    <div className='flex items-center gap-5'>
                                                        <Label className='font-thin'>{selectedGroup.items.length} items</Label>
                                                        <Label className='font-thin'>{new Intl.NumberFormat('en-PH', {
                                                            style: 'currency',
                                                            currency: 'PHP',
                                                        }).format(selectedGroup.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</Label>
                                                    </div>
                                                </div>
                                                <div className='flex items-center justify-between '>
                                                    <Label className='font-thin'>Shipping</Label>
                                                    <Label className='font-thin'>{new Intl.NumberFormat('en-PH', {
                                                        style: 'currency',
                                                        currency: 'PHP',
                                                    }).format(selectedGroup.total_amount - selectedGroup.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</Label>
                                                </div>
                                                <div className='flex items-center justify-between'>
                                                    <Label>Total</Label>
                                                    <Label>{new Intl.NumberFormat('en-PH', {
                                                        style: 'currency',
                                                        currency: 'PHP',
                                                    }).format(selectedGroup.total_amount)}</Label>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </>
                        ) : (
                            <>
                                <p>No order selected.</p>
                            </>
                        )}

                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white border border-black text-black hover:bg-black/10">Close</AlertDialogCancel>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button disabled={!selectedGroup || selectedGroup.order_status !== 'pending'} variant={'default'}>{buttonLoading && (
                                    <ClipLoader

                                        color='white'
                                        size={17}
                                    />
                                )}
                                    {buttonLoading ? "Loading..." : "Cancel Order"}</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will mean you agree to cancel your order.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                        if (!selectedGroup) return
                                        cancelOrder(selectedGroup.order_id)
                                    }} >Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

    );
};

export default PurchaseCard
