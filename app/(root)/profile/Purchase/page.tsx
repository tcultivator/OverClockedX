import React from 'react'
import db from '@/lib/db';
import { auth } from '@/auth';
import PurchaseCard from '@/components/Profile/PurchaseCard';
const Purchase = async () => {
    const session = await auth();
    const [rows] = await db.query(`SELECT orders.id AS order_id, 
            orders.email,
            orders.total_amount,
            orders.reference_id,
            orders.payment_status,
            orders.payment_method,
            orders.order_status,
            orders.created_at,
            order_items.quantity,
            order_items.price,
            order_items.sub_total,
            products.product_id,
            products.product_name,
            products.product_image FROM orders 
            JOIN order_items ON order_items.order_id = orders.id 
            JOIN products ON order_items.product_id = products.product_id 
            WHERE orders.email = ?;
    `, [session!.user?.email])
    const data = rows as Data[]
    console.log(data)
    type Data = {
        order_id: number;
        email: string;
        reference_id: string;
        total_amount: number;
        payment_status: string;
        payment_method:string;
        order_status: string;
        created_at: string;
        quantity: number;
        price: number;
        sub_total: number;
        product_id: string;
        product_name: string;
        product_image: string;
    }
    type GroupedOrder = {
        order_id: number;
        email: string;
        reference_id: string;
        total_amount: number;
        payment_status: string;
        payment_method:string;
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

    const groupData: GroupedOrder[] = []
    for (const products of data) {
        const checkIfHaveData = groupData.findIndex(gdata => gdata.order_id == products.order_id)
        console.log('eto ung laman, ', checkIfHaveData)
        if (checkIfHaveData == -1) {
            groupData.push({
                order_id: products.order_id,
                email: products.email,
                reference_id: products.reference_id,
                total_amount: products.total_amount,
                payment_status: products.payment_status,
                payment_method:products.payment_method,
                order_status: products.order_status,
                created_at: products.created_at,
                items: [{
                    product_id: products.product_id,
                    product_name: products.product_name,
                    product_image: products.product_image,
                    quantity: products.quantity,
                    price: products.price,
                    sub_total: products.sub_total
                }]
            })
        }
        else {
            groupData[checkIfHaveData].items.push({
                product_id: products.product_id,
                product_name: products.product_name,
                product_image: products.product_image,
                quantity: products.quantity,
                price: products.price,
                sub_total: products.sub_total
            })
        }
    }
    console.log(JSON.stringify(groupData, null, 2))

    return (
        <PurchaseCard groupData={groupData} />
    )
}

export default Purchase
