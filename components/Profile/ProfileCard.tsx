"use client";
import React from 'react'
import { Accounts } from '@/types/AccountsType';
import { useState } from 'react';
import Image from 'next/image';
type user = {
    user: {
        id: number;
        email: string;
        password: string;
        username: string;
        phone_number: number;
        profile_Image: string;
        gender: string;
        role: string;
        login_method: string;
    }

}
const ProfileCard = ({ user }: user) => {

    const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '');
    const [username, setUsername] = useState(user.username || '')
    const [gender, setGender] = useState(user.gender || '');
    const UpdateProfile = async () => {
        const res = await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, phoneNumber: phoneNumber, gender: gender, email: user.email }),
        })
        const result = await res.json()
    }



    return (
        <div className='w-full bg-black p-10'>
            <div className='pb-2 border-b border-white/30 mb-2 text-2xl'>
                <h1>Profile</h1>
            </div>
            <div className='flex '>
                <div className='w-full  p-10'>
                    <form action="" className='flex flex-col gap-3'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="">Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='w-max' htmlFor="">Contact Number</label>
                            <input type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div>
                            <label>Gender</label>
                            <div className="flex gap-4">
                                <div className="flex gap-2 items-center">
                                    <input type="radio" id="male" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} />
                                    <label htmlFor="male">Male</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input type="radio" id="female" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} />
                                    <label htmlFor="female">Female</label>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => UpdateProfile()} className='bg-green-400 w-max px-6 py-2 text-center flex justify-center items-center'>Save</button>

                    </form>
                </div>
                <div className='p-5 border-l border-white/30 w-[200px]  flex flex-col justify-center items-center text-center gap-2'>
                    <Image
                        src={user.profile_Image}
                        width={100}
                        height={100}
                        alt=''
                        className='rounded-[50%]'
                    />
                    <button className='w-full border border-white/50 p-2 text-[13px]' >Upload Image</button>
                </div>
            </div>

        </div>
    )
}

export default ProfileCard
