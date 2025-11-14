"use client";
import React from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ClipLoader } from 'react-spinners'
import { useEdgeStore } from '@/lib/edgestore';
import { Input } from "@/components/ui/input"
import { user } from '@/types/UserType'
import { useLoading } from '@/stores/loadingStore';

import { useUserStore } from '@/stores/userStore';
const ProfileCard = ({ user }: user) => {
    const [username, setUsername] = useState(user.username || '')
    const [profileImage, setProfileImage] = useState(user.profile_Image || '')
    const [imageTemp, setImageTemp] = useState<File | undefined>();

    //progress state for updating profile pic
    const [progress, setProgress] = useState<number>(0)

    //edgestore for updating the profile pic
    const { edgestore } = useEdgeStore();

    //zustand state for loading in button
    const buttonLoading = useLoading((state) => state.buttonLoading)
    const setButtonLoading = useLoading((state) => state.setButtonLoading)


    const UpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setButtonLoading(true)
        
        const res = await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, email: user.email }),
        })
        const result = await res.json()
        setTimeout(() => {
            setButtonLoading(false)
            
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
            setProfileImage(res.url)
        }
    }


    const setUser = useUserStore((state) => state.setUser)
    useEffect(() => {
        if (user) {
            setUser({
                email: user.email,
                name: user.username,
                image: user.profile_Image ?? null
            })
        } else {
            console.log('dapat eto naman gagana kapag naglogout')

        }
    }, [])



    return (
        <div className='w-full bg-black p-3 md:p-10'>
            <div className='pb-2 border-b border-white/30 mb-2 text-2xl'>
                <h1>Profile</h1>
            </div>
            <div className='flex gap-2'>
                <div className='w-full'>
                    <form onSubmit={UpdateProfile} className='flex flex-col gap-3'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="">Username</label>
                            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={buttonLoading === true}
                            className="bg-green-400 w-max px-6 py-2 text-center flex justify-center items-center gap-2"
                        >
                            {buttonLoading && (
                                <ClipLoader

                                    color='white'
                                    size={20}
                                />
                            )}
                            {buttonLoading ? "Saving..." : "Save"}
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
                                disabled={buttonLoading === true}
                                className="bg-green-400 w-full px-6 py-2 text-center flex justify-center items-center gap-2"
                                onClick={() => {
                                    SaveNewProfilePic()
                                }}
                            >
                                {buttonLoading && (
                                    <ClipLoader

                                        color='white'
                                        size={20}
                                    />
                                )}
                                {buttonLoading ? "Saving..." : "Save"}
                            </button>
                        </div>

                    }

                </div>
            </div>





        </div>
    )
}

export default ProfileCard
