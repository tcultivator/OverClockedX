"use client";
import React, { use } from 'react'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ClipLoader } from 'react-spinners'
import { useEdgeStore } from '@/lib/edgestore';
import { Input } from "@/components/ui/input"
import { user } from '@/types/UserType'
import { useLoading } from '@/stores/loadingStore';
import { Label } from '../ui/label';
import { useUserStore } from '@/stores/userStore';

import { GrFormEdit } from "react-icons/gr";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button';

import { Dropzone } from '@/components/upload/dropzone'
import { UploaderProvider, UploadFn } from '@/components/upload/uploader-provider'
import { ProgressCircle } from '@/components/upload/progress-circle'

const ProfileCard = ({ user }: user) => {
    
    const [username, setUsername] = useState(user.username || '')
    const [profileImage, setProfileImage] = useState(user.profile_Image || '')
    const [tempProfileImage, setTempProfileImage] = useState<string | null>(null)
    // const [imageTemp, setImageTemp] = useState<File | undefined>();

    // //progress state for updating profile pic
    // const [progress, setProgress] = useState<number>(0)

    //edgestore for updating the profile pic
    const { edgestore } = useEdgeStore();

    //zustand state for loading in button
    const buttonLoading = useLoading((state) => state.buttonLoading)
    const setButtonLoading = useLoading((state) => state.setButtonLoading)

    //e: React.FormEvent<HTMLFormElement>
    const UpdateProfile = async () => {
      
        // e.preventDefault();
        setButtonLoading(true)

        const res = await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, email: user.email, profile_Image: tempProfileImage ?? profileImage }),
        })
        const result = await res.json()
        setProfileImage(tempProfileImage ?? profileImage)
        setTimeout(() => {
            setButtonLoading(false)
            setDialogOpen(false)

        }, 1000);

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
            

        }
    }, [])

    const [dropzoneOpen, setDropzoneOpen] = useState(true)
    const [progress, setProgress] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const uploadFn: UploadFn = React.useCallback(

        async ({ file, onProgressChange, signal }) => {
            setDropzoneOpen(false)
            setLoading(true)
            const res = await edgestore.publicFiles.upload({
                file,
                signal,
                onProgressChange: (progress: number) => {
                    setProgress(progress)
                },
            });
            setTempProfileImage(res.url)
            setDropzoneOpen(false)
            // setAddedProducts((prev) => ({ ...prev, product_image: res.url }))
            setLoading(false)
            setProgress(0)
            return res;
        },
        [edgestore],
    );

    const [dialogOpen, setDialogOpen] = useState(false)


    return (
        <div className='w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] 2xl:w-[70%] mx-auto flex flex-col gap-2'>
            <div className=' '>
                <Label className='text-[15px] md:text-[20px] font-orbitron font-normal'>Profile</Label>
            </div>
            <div className='p-3 rounded bg-white flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                    <Label>USER INFO</Label>
                    <Dialog open={dialogOpen}>
                        <form >
                            <DialogTrigger asChild>
                                <button onClick={() => setDialogOpen(true)} className='flex items-center gap-1 justify-center text-[13px] font-normal text-black/70'><GrFormEdit /> Edit</button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit User Info</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your user info here. Click save when you&apos;re
                                        done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className='flex gap-2 p-5 w-full'>
                                        {dropzoneOpen ? <UploaderProvider uploadFn={uploadFn} autoUpload>
                                            <Dropzone
                                                dropzoneOptions={{
                                                    maxFiles: 5,
                                                    maxSize: 1024 * 1024 * 4,
                                                    accept: {
                                                        'image/*': ['.jpeg', '.jpg', '.png'],
                                                    },
                                                }}
                                            />

                                        </UploaderProvider> :
                                            <div className='relative w-[70%] flex flex-col gap-1 justify-center items-center aspect-square mx-auto'>
                                                {!loading && <Image src={tempProfileImage ?? profileImage} alt='' width={1000} height={1000} className='w-full ' />}
                                                {loading && <div className="flex items-center space-x-4 p-4 absolute top-0 left-0 bg-black/50 w-full h-full justify-center">
                                                    <ProgressCircle progress={progress} />
                                                </div>}
                                                {!loading && <Button onClick={() => setDropzoneOpen(true)}>Upload Again</Button>}
                                            </div>
                                        }



                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="name-1">Username</Label>
                                        <Input id="name-1" name="name" required value={username || ''} onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                    {/* <div className="grid gap-3">
                                        <Label htmlFor="username-1">Username</Label>
                                        <Input id="username-1" name="username" defaultValue="@peduarte" />
                                    </div> */}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button onClick={()=>setDialogOpen(false)} variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={UpdateProfile} type="submit">
                                        {buttonLoading && (
                                            <ClipLoader

                                                color='white'
                                                size={20}
                                            />
                                        )}
                                        {buttonLoading ? "Loading..." : "Save changes"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>

                </div>
                <div className='flex items-center gap-3'>
                    <div className=''>
                        <Image
                            src={profileImage}
                            width={60}
                            height={60}
                            alt=''
                            className='rounded-[50%] '
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-col justify-start gap-1'>
                            <Label className='font-thin'>Username</Label>
                            <Label className='font-light'>{username}</Label>
                        </div>
                        <div className='flex flex-col justify-start gap-1'>
                            <Label className='font-thin'>Email</Label>
                            <Label className='font-light'>{user.email}</Label>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default ProfileCard
