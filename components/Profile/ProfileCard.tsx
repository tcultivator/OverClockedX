"use client";
import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import { ClipLoader } from 'react-spinners'
import { useEdgeStore } from '@/lib/edgestore';
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
    const [loading, setLoading] = useState(false)

    const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '');
    const [username, setUsername] = useState(user.username || '')
    const [gender, setGender] = useState(user.gender || '');
    const [profileImage, setProfileImage] = useState(user.profile_Image || '')
    const [imageTemp, setImageTemp] = useState<File | undefined>();

    const [progress, setProgress] = useState<number>(0)

    const { edgestore } = useEdgeStore();
    const UpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        console.log('na click ung btn')
        const res = await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, phoneNumber: phoneNumber, gender: gender, email: user.email }),
        })
        const result = await res.json()
        setTimeout(() => {
            setLoading(false)
            console.log('the request is done ', result)
        }, 1000);

    }


    const UploadNewPic = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        setImageTemp(e.target.files?.[0])
        if (!uploadedFile) return
        // const uploadedFileURL = URL.createObjectURL(uploadedFile)
        // setProfileImage(uploadedFileURL)
    }

    const SaveNewProfilePic = async () => {
        if (imageTemp) {
            const res = await edgestore.publicFiles.upload({
                file: imageTemp,
                onProgressChange: (progress: number) => {
                    // you can use this to show a progress bar
                    console.log(progress);
                    setProgress(progress)
                },
            });
            const uploadNewImage = await fetch('/api/profileImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ profileImage: res.url, email: user.email }),
            })
            const result = await uploadNewImage.json()
            console.log(res);
            console.log(result)
            setProfileImage(res.url)
        }
    }



    return (
        <div className='w-full bg-black p-10'>
            <div className='pb-2 border-b border-white/30 mb-2 text-2xl'>
                <h1>Profile</h1>
            </div>
            <div className='flex '>
                <div className='w-full  p-10'>
                    <form onSubmit={UpdateProfile} className='flex flex-col gap-3'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="">Username</label>
                            <input className='input-Profile' type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className='w-max' htmlFor="">Contact Number</label>
                            <input className='input-Profile' type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div>
                            <label>Gender</label>
                            <div className="flex gap-4">
                                <div className="flex gap-2 items-center">
                                    <input className='input-Profile' type="radio" id="male" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} />
                                    <label htmlFor="male">Male</label>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input className='input-Profile' type="radio" id="female" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} />
                                    <label htmlFor="female">Female</label>
                                </div>
                            </div>
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
                <div className='p-5 border-l border-white/30 w-[200px]  flex flex-col justify-center items-center text-center gap-2'>
                    <Image
                        src={profileImage}
                        width={100}
                        height={100}
                        alt=''
                        className='rounded-[50%]'
                    />
                    <div className="relative w-full">
                        <input
                            type="file"
                            accept="image/*"
                            id="imageUpload"
                            className="hidden"
                            onChange={(e) => UploadNewPic(e)}
                        />
                        <label
                            htmlFor="imageUpload"
                            className="w-full border border-white/50 p-2 text-[13px] text-center block cursor-pointer"
                        >
                            Upload Image
                        </label>
                    </div>
                    {imageTemp &&
                        <div className='flex flex-col gap-2'>
                            <div className='h-[6px] w-44 border rounded overflow-hidden '>
                                <div className='h-full bg-white transition-all duration-200'
                                    style={{
                                        width: `${progress}%`
                                    }} />
                            </div>
                            <button
                                type="button"
                                disabled={loading === true}
                                className="bg-green-400 w-full px-6 py-2 text-center flex justify-center items-center gap-2"
                                onClick={() => {
                                    SaveNewProfilePic()
                                }}
                            >
                                {loading && (
                                    <ClipLoader

                                        color='white'
                                        size={20}
                                    />
                                )}
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>

                    }

                </div>
            </div>





        </div>
    )
}

export default ProfileCard
