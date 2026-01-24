"use client";
import React from 'react'
import { useState } from 'react';
import { ClipLoader } from 'react-spinners'


import { luzonProvinces } from '@/utils/datasetAddress/province'
import { luzonPlaces } from '@/utils/datasetAddress/citiesAndMunicipality'
import { barangaysJaen } from '@/utils/datasetAddress/barangay'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserAddress } from '@/types/UserAddressTypes'
import { useLoading } from '@/stores/loadingStore';

import { Label } from '../ui/label';
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

import { GrFormEdit } from "react-icons/gr";

interface Props {
    address?: UserAddress;
    email?: string | null | undefined
}
const AddressCard = ({ address, email }: Props) => {
    //zustand state for loading in button
    const buttonLoading = useLoading((state) => state.buttonLoading)
    const setButtonLoading = useLoading((state) => state.setButtonLoading)
    const [rName, setRName] = useState<string>(address?.rname ?? '');
    const [address_line_1, setAddress_line_1] = useState<string>(address?.address_line_1 ?? '');
    const [cityMunicipality, setCityMunicipality] = useState<string>(address?.cityMunicipality ?? '');
    const [postal_code, setPostal_code] = useState<string>(address?.postal_code.toString() ?? '');
    const [barangay, setBarangay] = useState<string>(address?.barangay ?? '');
    const [province, setProvince] = useState<string>(address?.province ?? '');
    const [phone_number, setPhone_number] = useState<string>(address?.phone_number ?? '');

    const [dialogOpen, setDialogOpen] = useState(false)

    const UpdateAddress = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('check if button click')
        e.preventDefault();
        if (!email) {
            console.log('testing to')
            return
        }
        setButtonLoading(true)
        const res = await fetch('/api/addressRoute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rName: rName, phone_number: phone_number, address_line_1: address_line_1, cityMunicipality: cityMunicipality, barangay: barangay, province: province, postal_code: Number(postal_code), email: email }),
        })
        const result = await res.json()
        setTimeout(() => {
            setButtonLoading(false)
            setDialogOpen(false)
            console.log('the request is done ', result)
        }, 1000);
    }


    return (
        <div className='w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] 2xl:w-[70%] mx-auto flex flex-col gap-2'>
            <div className='p-3 rounded bg-white flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                    <Label>SHIPPING INFO</Label>
                    <Dialog open={dialogOpen}>
                        <DialogTrigger asChild>
                            <button onClick={() => setDialogOpen(true)} className='flex items-center gap-1 justify-center text-[13px] font-normal text-black/70'><GrFormEdit /> Edit</button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Shipping Info</DialogTitle>
                                <DialogDescription>
                                    Make changes to your shipping info here. Click save when you&apos;re
                                    done.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={UpdateAddress} className='flex flex-col gap-3'>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex flex-col gap-1'>
                                        <Label htmlFor="">Fullname</Label>
                                        <Input required type="text" value={rName || ''} onChange={(e) => setRName(e.target.value)} />
                                    </div>

                                    <div className='flex flex-col gap-1'>
                                        <Label htmlFor="">Phone Number</Label>
                                        <Input required type="number" value={phone_number || ''} onChange={(e) => setPhone_number(e.target.value)} />
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <Label htmlFor="">Province</Label>
                                        <Input required list='province' name='province' value={province || ''} onChange={(e) => setProvince(e.target.value)} />
                                        <datalist id='province'>
                                            {luzonProvinces.slice(0, 5).map((data, index) => (
                                                <option key={index} value={data}>{data}</option>
                                            ))}
                                        </datalist>
                                    </div>

                                    <div className='flex flex-col gap-1'>
                                        <Label htmlFor="">Address line 1</Label>
                                        <Input required  value={address_line_1 || ''} onChange={(e) => setAddress_line_1(e.target.value)} />

                                    </div>
                                    <div className='flex gap-1 w-full box-border'>

                                        <div className='flex flex-col gap-1'>
                                            <Label htmlFor="">City/Municipality</Label>
                                            <Input required list='city' name='city' value={cityMunicipality || ''} onChange={(e) => setCityMunicipality(e.target.value)} />
                                            <datalist id='city'>
                                                {luzonPlaces.slice(0, 5).map((data, index) => (
                                                    <option key={index} value={data}>{data}</option>
                                                ))}
                                            </datalist>
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <Label htmlFor="">Barangay</Label>
                                            <Input required list='barangay' name='barangay' value={barangay || ''} onChange={(e) => setBarangay(e.target.value)} />
                                            <datalist id='barangay'>
                                                {barangaysJaen.slice(0, 5).map((data, index) => (
                                                    <option key={index} value={data}>{data}</option>
                                                ))}
                                            </datalist>
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <Label htmlFor="">Postal Code</Label>
                                            <Input required value={postal_code || ''} type='number' onChange={(e) => setPostal_code(e.target.value)} />
                                            
                                        </div>

                                    </div>

                                    
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button onClick={() => setDialogOpen(false)} variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">
                                        {buttonLoading && (
                                            <ClipLoader

                                                color='white'
                                                size={20}
                                            />
                                        )}
                                        {buttonLoading ? "Loading..." : "Save changes"}

                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>

                    </Dialog>
                </div>
                <div className='flex flex-col gap-2 items-start'>
                    <div className='flex flex-col justify-start gap-1 '>
                        <Label className='font-thin'>Fullname</Label>
                        <Label className='font-light'>{rName || 'not set'}</Label>
                    </div>
                    <div className='flex flex-col justify-start gap-1 '>
                        <Label className='font-thin'>Phone Number</Label>
                        <Label className='font-light'>{phone_number || 'not set'}</Label>
                    </div>
                    <div className='flex flex-col justify-start gap-1'>
                        <Label className='font-thin'>Province</Label>
                        <Label className='font-light'>{province || 'not set'}</Label>
                    </div>
                    <div className='flex flex-col justify-start gap-1'>
                        <Label className='font-thin'>Address line 1</Label>
                        <Label className='font-light'>{address_line_1 || 'not set'}</Label>
                    </div>
                    <div className='flex flex-col justify-start gap-1 '>
                        <Label className='font-thin'>City/Municipality</Label>
                        <Label className='font-light'>{cityMunicipality || 'not set'}</Label>
                    </div>
                    <div className='flex flex-col justify-start gap-1 '>
                        <Label className='font-thin'>Barangay</Label>
                        <Label className='font-light'>{barangay || 'not set'}</Label>
                    </div>

                    <div className='flex flex-col justify-start gap-1'>
                        <Label className='font-thin'>Postal Code</Label>
                        <Label className='font-light'>{postal_code || 'not set'}</Label>
                    </div>

                </div>

            </div>

        </div >
    )
}

export default AddressCard
