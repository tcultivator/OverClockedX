import React from 'react'
import AddressCard from '@/components/Profile/AddressCard'
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
interface userAddress {
    id: number;
    email: string;
    rname: string;
    address: string;
    postal: string;
    description: string;
}
const Address = async () => {
    const session = await auth();
    if (!session) {
        redirect('/')
    }
    const result = await db.query('SELECT * FROM user_address WHERE email = ?', [session.user?.email])
    const address = result[0] as userAddress[]

    return (
        <AddressCard
            email={session.user?.email}
            address={address[0]} />
    )
}

export default Address
