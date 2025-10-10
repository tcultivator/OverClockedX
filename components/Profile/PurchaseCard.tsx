"use client"
import React from 'react'
import Image from 'next/image';
type GroupedOrder = {
    order_id: number;
    email: string;
    reference_id: string;
    total_amount: number;
    payment_status: string;
    order_status: string;
    created_at: string;
    items: {
        product_id: string;
        product_name: string;
        product_image: string;
        quantity: number;
        price: number;
        sub_total: number;
    }[];
};
type Props = {
    groupData: GroupedOrder[]
}
import { useState } from 'react';
const PurchaseCard = ({ groupData }: Props) => {
    const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

    const toggleExpand = (index: number) => {
        setExpandedGroups(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className='flex flex-col gap-2 w-full bg-black lg:max-h-[400px] overflow-auto lg:p-2'>
            {groupData.map((group, groupIndex) => {
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
                                maxHeight: isExpanded ? 'none' : '100px',
                                overflow: 'hidden',
                                transition: 'max-height 0.6s ease',
                            }}
                            className='flex flex-col gap-2 box-border relative'
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
    );
};

export default PurchaseCard
