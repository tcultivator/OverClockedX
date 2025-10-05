"use client";
import React from 'react'
import { useState } from 'react';
import { ClipLoader } from 'react-spinners'
interface UserAddress {
    id: number;
    email: string;
    rname: string;
    address: string;
    postal: string;
    description: string;

}
interface Props {
    address?: UserAddress;
    email?: string | null | undefined
}
const AddressCard = ({ address, email }: Props) => {
    const [loading, setLoading] = useState(false)
    const [rName, setRName] = useState<string>(address?.rname ?? '');
    const [addresses, setAddresses] = useState<string>(address?.address ?? '');
    const [postal, setPostal] = useState<string>(address?.postal ?? '');
    const [description, setDescription] = useState<string>(address?.description ?? '');
    const UpdateAddress = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            console.log('testing to')
            return
        }
        setLoading(true)
        const res = await fetch('/api/addressRoute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rName: rName, address: addresses, postal: postal, description: description, email: email }),
        })
        const result = await res.json()
        setTimeout(() => {
            setLoading(false)
            console.log('the request is done ', result)
        }, 1000);
    }
    return (
        <div className='w-full bg-black p-10'>
            <div className='pb-2 border-b border-white/30 mb-2 text-2xl'>
                <h1>Address</h1>
            </div>
            <div className='flex '>
                <div className='w-full  p-10'>
                    <form onSubmit={UpdateAddress} className='flex flex-col gap-3'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="">Reciever Name</label>
                            <input className='input-Profile' type="text" value={rName} onChange={(e) => setRName(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='w-max' htmlFor="">Complete Address</label>
                            <input className='input-Profile' type="text" value={addresses} onChange={(e) => setAddresses(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='w-max' htmlFor="">Postal Code</label>
                            <input className='input-Profile' type="number" value={postal} onChange={(e) => setPostal(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="">Specific Address Description</label>
                            <textarea className='input-Profile' value={description} onChange={(e) => setDescription(e.target.value)}  name="" id="" placeholder='please specify which location. eg. street sign, trademark'></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading === true}
                            className="bg-green-400 w-max px-6 py-2 text-center flex justify-center items-center gap-2"
                        >
                            {loading && (
                                <ClipLoader

                                    color='white'
                                    size={20}
                                />
                            )}
                            {loading ? "Saving..." : "Save"}
                        </button>

                    </form>
                </div>

            </div>

        </div>
    )
}

export default AddressCard
