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
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label'
import { ScrollArea } from "@/components/ui/scroll-area"
type Props = {
    groupData: GroupedOrder[]
}
import { useState, useEffect } from 'react';
import { usePurchaseStore } from '@/stores/purchaseStore';
const PurchaseCard = ({ groupData }: Props) => {
    const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});
    const [selectedGroup, setSelectedGroup] = useState<GroupedOrder | null>(null)
    const [openDialog, setOpenDialog] = useState(false)

    const purchaseData = usePurchaseStore((state) => state.purchaseData)
    const setPurchaseData = usePurchaseStore((state) => state.setPurchaseData)
    useEffect(() => {
        setPurchaseData(groupData)
    }, [])
    const toggleExpand = (index: number) => {
        setExpandedGroups(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };



    return (
        <>
            <div className='flex flex-col gap-2 w-full bg-black lg:max-h-[400px] overflow-auto lg:p-2'>
                {purchaseData.map((group, groupIndex) => {
                    const isExpanded = expandedGroups[groupIndex] || false;

                    return (
                        <div
                            className='flex flex-col gap-2 bg-[#1E1E1E]  p-2 text-[11px] lg:text-[15px] lg:rounded-[10px] lg:p-4'
                            key={groupIndex}
                        >
                            <div className='flex justify-between items-center'>
                                <h1>
                                    Reference Id: <span className='font-bold'>{group.reference_id}</span>
                                </h1>
                                <h1 className='text-red-400'>{group.order_status}</h1>
                            </div>

                            <div
                                style={{
                                    maxHeight: isExpanded ? `${group.items.length * 100}px` : '90px',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.6s ease',
                                }}
                                className='flex flex-col gap-2 box-border relative'
                                onClick={() => {
                                    setSelectedGroup(group)
                                    setOpenDialog(true)
                                }}
                            >
                                {group.items.map((item, itemIndex) => (
                                    <div
                                        className='flex items-center justify-between rounded bg-black p-2'
                                        key={itemIndex}
                                    >
                                        <div className='flex gap-1 items-start'>
                                            <Image
                                                src={item.product_image}
                                                alt=""
                                                className='w-20 border border-white/50'
                                                width={100}
                                                height={100}
                                            />
                                            <div className='flex flex-col'>
                                                <h1>{item.product_name}</h1>
                                                <h1>x{item.quantity}</h1>
                                                <h1>
                                                    {new Intl.NumberFormat('en-PH', {
                                                        style: 'currency',
                                                        currency: 'PHP',
                                                    }).format(item.price)}
                                                </h1>
                                            </div>
                                        </div>
                                        <h1>
                                            SubTotal:{' '}
                                            {new Intl.NumberFormat('en-PH', {
                                                style: 'currency',
                                                currency: 'PHP',
                                            }).format(item.sub_total)}
                                        </h1>
                                    </div>
                                ))}
                            </div>

                            <div className='flex justify-between items-center'>
                                {group.items.length > 1 && (
                                    <button
                                        onClick={() => toggleExpand(groupIndex)}
                                        className='text-blue-400 text-sm'
                                    >
                                        {isExpanded ? 'Show Less' : 'Show More'}
                                    </button>
                                )}
                                <h1 className='text-end'>
                                    {group.items.length} items:{' '}
                                    <span>
                                        {new Intl.NumberFormat('en-PH', {
                                            style: 'currency',
                                            currency: 'PHP',
                                        }).format(group.total_amount)}
                                    </span>
                                </h1>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Alert Dialog */}
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent className="bg-[#1E1E1E] text-white border border-gray-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purchase Details</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedGroup ? (
                                <>
                                    <div className='flex flex-col'>
                                        <Label className='text-white/60 text-md'>Order Id:{selectedGroup.order_id}</Label>
                                        <Label className='text-white/60 text-sm'>{new Date(selectedGroup.created_at).toLocaleString("en-US", { month: "long", day: 'numeric', year: "numeric" })}</Label>
                                    </div>
                                    <div className='flex gap-2 text-white'>
                                        <div className=' flex flex-col gap-2 w-full'>
                                            <div className='p-3 border rounded-[10px] border-black/15 flex flex-col gap-2'>
                                                <div className='flex items-center gap-3'>
                                                    <Label>Purchase Item</Label>
                                                    <Label className='font-thin flex items-center justify-center p-1 rounded bg-red-400/30 text-red-400 w-max px-2'>Order {selectedGroup.order_status}</Label>
                                                </div>
                                                <Label className="text-sm text-white/40">These are the products in the order.</Label>

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
                                                    <Label className='font-thin flex items-center justify-center p-1 rounded bg-green-400/30 text-green-400 w-max'>Payment {selectedGroup.payment_status}</Label>
                                                </div>
                                                <Label className="text-[12px] md:text-sm text-start text-white/40">A summary of the customer's order details.</Label>
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
                                                            }).format(selectedGroup.items.reduce((sum, item) => sum + item.sub_total * item.quantity, 0))}</Label>
                                                        </div>

                                                    </div>
                                                    <div className='flex items-center justify-between '>
                                                        <Label className='font-thin'>Shipping</Label>
                                                        <Label className='font-thin'>{new Intl.NumberFormat('en-PH', {
                                                            style: 'currency',
                                                            currency: 'PHP',
                                                        }).format(selectedGroup.total_amount - selectedGroup.items.reduce((sum, item) => sum + item.sub_total * item.quantity, 0))}</Label>
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
                                <p>No order selected.</p>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Close</AlertDialogCancel>
                        <AlertDialogAction disabled={!selectedGroup || selectedGroup.order_status !== 'pending'} className="bg-blue-500 hover:bg-blue-600 text-white">Cancel Order</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>

    );
};

export default PurchaseCard
